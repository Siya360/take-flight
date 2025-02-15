// pkg/bookings/repository/mongodb/booking_repository.go

package mongodb

import (
	"context"
	"time"

	"github.com/Siya360/take-flight/server/pkg/bookings/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoBookingRepository struct {
	collection *mongo.Collection
}

func NewMongoBookingRepository(db *mongo.Database) *MongoBookingRepository {
	return &MongoBookingRepository{
		collection: db.Collection("bookings"),
	}
}

func (r *MongoBookingRepository) Create(ctx context.Context, booking *model.Booking) error {
	if booking.CreatedAt.IsZero() {
		booking.CreatedAt = time.Now()
	}
	booking.UpdatedAt = time.Now()

	_, err := r.collection.InsertOne(ctx, booking)
	return err
}

func (r *MongoBookingRepository) FindByID(ctx context.Context, id string) (*model.Booking, error) {
	var booking model.Booking
	err := r.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&booking)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &booking, err
}

func (r *MongoBookingRepository) Update(ctx context.Context, booking *model.Booking) error {
	booking.UpdatedAt = time.Now()

	_, err := r.collection.ReplaceOne(
		ctx,
		bson.M{"_id": booking.ID},
		booking,
	)
	return err
}

func (r *MongoBookingRepository) Delete(ctx context.Context, id string) error {
	_, err := r.collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (r *MongoBookingRepository) Search(ctx context.Context, criteria model.SearchBookingRequest) ([]*model.Booking, error) {
	filter := bson.D{}

	// Build filter based on search criteria
	if criteria.UserID != "" {
		filter = append(filter, bson.E{Key: "user_id", Value: criteria.UserID})
	}
	if criteria.FlightID != "" {
		filter = append(filter, bson.E{Key: "flight_id", Value: criteria.FlightID})
	}
	if criteria.Status != "" {
		filter = append(filter, bson.E{Key: "status", Value: criteria.Status})
	}
	if criteria.StartDate != nil && criteria.EndDate != nil {
		filter = append(filter, bson.E{
			Key: "booking_date",
			Value: bson.D{
				{Key: "$gte", Value: criteria.StartDate},
				{Key: "$lte", Value: criteria.EndDate},
			},
		})
	}

	opts := options.Find().SetSort(bson.D{{Key: "booking_date", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var bookings []*model.Booking
	if err := cursor.All(ctx, &bookings); err != nil {
		return nil, err
	}

	return bookings, nil
}

func (r *MongoBookingRepository) CountBookingsByDateRange(ctx context.Context, userID string, startDate, endDate time.Time) (int64, error) {
	filter := bson.D{
		{Key: "user_id", Value: userID},
		{Key: "booking_date", Value: bson.D{
			{Key: "$gte", Value: startDate},
			{Key: "$lt", Value: endDate},
		}},
		{Key: "status", Value: bson.D{
			{Key: "$ne", Value: model.BookingStatusCancelled},
		}},
	}

	count, err := r.collection.CountDocuments(ctx, filter)
	if err != nil {
		return 0, err
	}

	return count, nil
}

func (r *MongoBookingRepository) GetUserBookings(ctx context.Context, userID string) ([]*model.Booking, error) {
	filter := bson.D{
		{Key: "user_id", Value: userID},
		{Key: "status", Value: bson.D{
			{Key: "$ne", Value: model.BookingStatusCancelled},
		}},
	}

	opts := options.Find().SetSort(bson.D{{Key: "booking_date", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var bookings []*model.Booking
	if err := cursor.All(ctx, &bookings); err != nil {
		return nil, err
	}

	return bookings, nil
}

func (r *MongoBookingRepository) GetFlightBookings(ctx context.Context, flightID string) ([]*model.Booking, error) {
	filter := bson.D{
		{Key: "flight_id", Value: flightID},
		{Key: "status", Value: bson.D{
			{Key: "$ne", Value: model.BookingStatusCancelled},
		}},
	}

	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := r.collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var bookings []*model.Booking
	if err := cursor.All(ctx, &bookings); err != nil {
		return nil, err
	}

	return bookings, nil
}
