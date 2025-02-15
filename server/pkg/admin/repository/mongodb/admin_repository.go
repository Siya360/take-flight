// pkg/admin/repository/mongodb/admin_repository.go

package mongodb

import (
	"context"
	"time"

	"github.com/Siya360/take-flight/server/pkg/admin/model"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type MongoAdminRepository struct {
	configDB    *mongo.Collection
	activityDB  *mongo.Collection
	settingsDB  *mongo.Collection
	dashboardDB *mongo.Collection
}

func NewMongoAdminRepository(db *mongo.Database) *MongoAdminRepository {
	return &MongoAdminRepository{
		configDB:    db.Collection("system_configs"),
		activityDB:  db.Collection("admin_activities"),
		settingsDB:  db.Collection("notification_settings"),
		dashboardDB: db.Collection("dashboard_stats"),
	}
}

func (r *MongoAdminRepository) SaveSystemConfig(ctx context.Context, config *model.SystemConfig) error {
	opts := options.Replace().SetUpsert(true)
	_, err := r.configDB.ReplaceOne(
		ctx,
		bson.M{"_id": config.ID},
		config,
		opts,
	)
	return err
}

func (r *MongoAdminRepository) GetSystemConfig(ctx context.Context) (*model.SystemConfig, error) {
	var config model.SystemConfig
	err := r.configDB.FindOne(ctx, bson.M{}).Decode(&config)
	if err == mongo.ErrNoDocuments {
		// Return default config if none exists
		return &model.SystemConfig{
			BookingEnabled:    true,
			MaintenanceMode:   false,
			MaxBookingsPerDay: 100,
			CreatedAt:         time.Now(),
			UpdatedAt:         time.Now(),
		}, nil
	}
	return &config, err
}

func (r *MongoAdminRepository) LogAdminActivity(ctx context.Context, activity *model.AdminActivity) error {
	_, err := r.activityDB.InsertOne(ctx, activity)
	return err
}

func (r *MongoAdminRepository) GetAdminActivities(ctx context.Context, startDate, endDate time.Time) ([]*model.AdminActivity, error) {
	filter := bson.M{
		"created_at": bson.M{
			"$gte": startDate,
			"$lte": endDate,
		},
	}

	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}})

	cursor, err := r.activityDB.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var activities []*model.AdminActivity
	if err := cursor.All(ctx, &activities); err != nil {
		return nil, err
	}

	return activities, nil
}

func (r *MongoAdminRepository) SaveNotificationSettings(ctx context.Context, settings *model.NotificationSettings) error {
	opts := options.Replace().SetUpsert(true)
	_, err := r.settingsDB.ReplaceOne(
		ctx,
		bson.M{"admin_id": settings.AdminID},
		settings,
		opts,
	)
	return err
}

func (r *MongoAdminRepository) GetNotificationSettings(ctx context.Context, adminID string) (*model.NotificationSettings, error) {
	var settings model.NotificationSettings
	err := r.settingsDB.FindOne(ctx, bson.M{"admin_id": adminID}).Decode(&settings)
	if err == mongo.ErrNoDocuments {
		return nil, nil
	}
	return &settings, err
}

// Stats Repository Methods

func (r *MongoAdminRepository) GetDashboardStats(ctx context.Context) (*model.DashboardStats, error) {
	var stats model.DashboardStats
	err := r.dashboardDB.FindOne(ctx, bson.M{}).Decode(&stats)
	if err == mongo.ErrNoDocuments {
		return &model.DashboardStats{
			UpdatedAt: time.Now(),
		}, nil
	}
	return &stats, err
}

func (r *MongoAdminRepository) GetRevenueStats(ctx context.Context, startDate, endDate time.Time) (*model.RevenueStats, error) {
	// Pipeline for daily revenue
	dailyPipeline := mongo.Pipeline{
		bson.D{
			{Key: "$match", Value: bson.D{
				{Key: "booking_date", Value: bson.D{
					{Key: "$gte", Value: startDate},
					{Key: "$lte", Value: endDate},
				}},
			}},
		},
		bson.D{
			{Key: "$group", Value: bson.D{
				{Key: "_id", Value: bson.D{
					{Key: "$dateToString", Value: bson.D{
						{Key: "format", Value: "%Y-%m-%d"},
						{Key: "date", Value: "$booking_date"},
					}},
				}},
				{Key: "revenue", Value: bson.D{{Key: "$sum", Value: "$total_price"}}},
				{Key: "bookings", Value: bson.D{{Key: "$sum", Value: 1}}},
			}},
		},
		bson.D{
			{Key: "$sort", Value: bson.D{{Key: "_id", Value: 1}}},
		},
	}

	// Pipeline for monthly revenue
	monthlyPipeline := mongo.Pipeline{
		bson.D{
			{Key: "$match", Value: bson.D{
				{Key: "booking_date", Value: bson.D{
					{Key: "$gte", Value: startDate},
					{Key: "$lte", Value: endDate},
				}},
			}},
		},
		bson.D{
			{Key: "$group", Value: bson.D{
				{Key: "_id", Value: bson.D{
					{Key: "$dateToString", Value: bson.D{
						{Key: "format", Value: "%Y-%m"},
						{Key: "date", Value: "$booking_date"},
					}},
				}},
				{Key: "revenue", Value: bson.D{{Key: "$sum", Value: "$total_price"}}},
				{Key: "bookings", Value: bson.D{{Key: "$sum", Value: 1}}},
			}},
		},
		bson.D{
			{Key: "$sort", Value: bson.D{{Key: "_id", Value: 1}}},
		},
	}

	// Execute daily aggregation
	dailyCursor, err := r.dashboardDB.Aggregate(ctx, dailyPipeline)
	if err != nil {
		return nil, err
	}
	defer dailyCursor.Close(ctx)

	var dailyResults []model.DailyRevenue
	if err := dailyCursor.All(ctx, &dailyResults); err != nil {
		return nil, err
	}

	// Execute monthly aggregation
	monthlyCursor, err := r.dashboardDB.Aggregate(ctx, monthlyPipeline)
	if err != nil {
		return nil, err
	}
	defer monthlyCursor.Close(ctx)

	var monthlyResults []model.MonthlyRevenue
	if err := monthlyCursor.All(ctx, &monthlyResults); err != nil {
		return nil, err
	}

	// Calculate total revenue
	var totalRevenue float64
	for _, daily := range dailyResults {
		totalRevenue += daily.Revenue
	}

	return &model.RevenueStats{
		Daily:   dailyResults,
		Monthly: monthlyResults,
		Total:   totalRevenue,
	}, nil
}

func (r *MongoAdminRepository) GetSystemMetrics(ctx context.Context) (*model.SystemMetrics, error) {
	var metrics model.SystemMetrics
	err := r.dashboardDB.FindOne(ctx, bson.M{}).Decode(&metrics)
	if err == mongo.ErrNoDocuments {
		return &model.SystemMetrics{
			Timestamp: time.Now(),
		}, nil
	}
	return &metrics, err
}
