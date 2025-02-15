// pkg/flights/repository/mongodb/flight_repository.go

package mongodb

import (
	"context"
	"time"

	"github.com/Siya360/take-flight/server/pkg/flights/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoFlightRepository struct {
	collection *mongo.Collection
}

func NewMongoFlightRepository(db *mongo.Database) *MongoFlightRepository {
	return &MongoFlightRepository{
		collection: db.Collection("flights"),
	}
}

func (r *MongoFlightRepository) Create(ctx context.Context, flight *model.Flight) error {
	_, err := r.collection.InsertOne(ctx, flight)
	return err
}

func (r *MongoFlightRepository) FindByID(ctx context.Context, id string) (*model.Flight, error) {
	var flight model.Flight
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&flight)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &flight, err
}

func (r *MongoFlightRepository) Update(ctx context.Context, flight *model.Flight) error {
	_, err := r.collection.ReplaceOne(ctx, bson.M{"_id": flight.ID}, flight)
	return err
}

func (r *MongoFlightRepository) Delete(ctx context.Context, id string) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (r *MongoFlightRepository) Search(ctx context.Context, criteria model.SearchFlightRequest) ([]*model.Flight, error) {
	filter := bson.M{
		"departure_city": criteria.DepartureCity,
		"arrival_city":   criteria.ArrivalCity,
		"departure_time": bson.M{
			"$gte": criteria.DepartureDate,
			"$lt":  criteria.DepartureDate.Add(24 * time.Hour),
		},
		"available_seats": bson.M{
			"$gte": criteria.Passengers,
		},
		"status": model.FlightStatusScheduled,
	}

	opts := options.Find().SetSort(bson.D{{Key: "departure_time", Value: 1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var flights []*model.Flight
	if err := cursor.All(ctx, &flights); err != nil {
		return nil, err
	}

	return flights, nil
}

func (r *MongoFlightRepository) UpdateSeats(ctx context.Context, flightID string, seats int) error {
	_, err := r.collection.UpdateOne(
		ctx,
		bson.M{"_id": flightID},
		bson.M{
			"$set": bson.M{
				"available_seats": seats,
				"updated_at":      time.Now(),
			},
		},
	)
	return err
}
