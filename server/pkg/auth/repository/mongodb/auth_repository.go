// pkg/auth/repository/mongodb/auth_repository.go

package mongodb

import (
	"context"
	"time"

	"github.com/Siya360/take-flight/server/pkg/auth/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoAuthRepository struct {
	users  *mongo.Collection
	tokens *mongo.Collection
}

func NewMongoAuthRepository(db *mongo.Database) *MongoAuthRepository {
	return &MongoAuthRepository{
		users:  db.Collection("users"),
		tokens: db.Collection("tokens"),
	}
}

func (r *MongoAuthRepository) FindByEmail(ctx context.Context, email string) (*model.User, error) {
	var user model.User
	err := r.users.FindOne(ctx, bson.M{"email": email}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &user, err
}

func (r *MongoAuthRepository) FindByID(ctx context.Context, id string) (*model.User, error) {
	var user model.User
	err := r.users.FindOne(ctx, bson.M{"_id": id}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &user, err
}

func (r *MongoAuthRepository) Create(ctx context.Context, user *model.User) error {
	if user.CreatedAt.IsZero() {
		user.CreatedAt = time.Now()
	}
	user.UpdatedAt = time.Now()

	_, err := r.users.InsertOne(ctx, user)
	return err
}

func (r *MongoAuthRepository) Update(ctx context.Context, user *model.User) error {
	user.UpdatedAt = time.Now()

	_, err := r.users.ReplaceOne(
		ctx,
		bson.M{"_id": user.ID},
		user,
	)
	return err
}

func (r *MongoAuthRepository) Delete(ctx context.Context, id string) error {
	_, err := r.users.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

func (r *MongoAuthRepository) SaveToken(ctx context.Context, userID string, tokenStr string, expiresAt time.Time) error {
	_, err := r.tokens.UpdateOne(
		ctx,
		bson.M{"user_id": userID},
		bson.M{
			"$set": bson.M{
				"token":      tokenStr,
				"expires_at": expiresAt,
				"updated_at": time.Now(),
			},
		},
		options.Update().SetUpsert(true),
	)
	return err
}

func (r *MongoAuthRepository) FindToken(ctx context.Context, userID string) (string, error) {
	var result struct {
		Token     string    `bson:"token"`
		ExpiresAt time.Time `bson:"expires_at"`
	}

	err := r.tokens.FindOne(
		ctx,
		bson.M{
			"user_id":    userID,
			"expires_at": bson.M{"$gt": time.Now()},
		},
	).Decode(&result)

	if err == mongo.ErrNoDocuments {
		return "", nil
	}
	return result.Token, err
}

func (r *MongoAuthRepository) DeleteToken(ctx context.Context, userID string) error {
	_, err := r.tokens.DeleteOne(ctx, bson.M{"user_id": userID})
	return err
}

func (r *MongoAuthRepository) BlacklistToken(ctx context.Context, userID string, tokenStr string, expiration time.Duration) error {
	_, err := r.tokens.InsertOne(
		ctx,
		bson.M{
			"user_id":     userID,
			"token":       tokenStr,
			"blacklisted": true,
			"created_at":  time.Now(),
			"expires_at":  time.Now().Add(expiration),
		},
	)
	return err
}

func (r *MongoAuthRepository) IsTokenBlacklisted(ctx context.Context, userID string, tokenStr string) (bool, error) {
	count, err := r.tokens.CountDocuments(
		ctx,
		bson.M{
			"user_id":     userID,
			"token":       tokenStr,
			"blacklisted": true,
			"expires_at":  bson.M{"$gt": time.Now()},
		},
	)
	return count > 0, err
}

func (r *MongoAuthRepository) PurgeExpiredTokens(ctx context.Context) error {
	_, err := r.tokens.DeleteMany(
		ctx,
		bson.M{"expires_at": bson.M{"$lt": time.Now()}},
	)
	return err
}
