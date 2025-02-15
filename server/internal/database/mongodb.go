// internal/database/mongodb.go

package database

import (
	"context"
	"fmt"
	"sync/atomic"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

// MongoDBConnection implements Connection for MongoDB
type MongoDBConnection struct {
	client    *mongo.Client
	config    *Config
	options   *ConnectionOptions
	connected int32
	database  *mongo.Database
}

// NewMongoDBConnection creates a new MongoDB connection
func NewMongoDBConnection(cfg *Config, opts *ConnectionOptions) (*MongoDBConnection, error) {
	if err := ValidateConfig(cfg); err != nil {
		return nil, err
	}
	if opts == nil {
		opts = DefaultConnectionOptions()
	}
	return &MongoDBConnection{
		config:  cfg,
		options: opts,
	}, nil
}

// Connect establishes a connection to MongoDB
func (m *MongoDBConnection) Connect(ctx context.Context) error {
	if m.IsConnected() {
		return nil
	}

	uri := fmt.Sprintf("mongodb://%s:%s@%s:%d/%s",
		m.config.Username,
		m.config.Password,
		m.config.Host,
		m.config.Port,
		m.config.Database,
	)

	clientOptions := options.Client().
		ApplyURI(uri).
		SetMaxPoolSize(uint64(m.config.MaxPoolSize)).
		SetConnectTimeout(m.config.ConnTimeout).
		SetSocketTimeout(m.config.WriteTimeout)

	return RetryWithBackoff(ctx, func() error {
		client, err := mongo.Connect(ctx, clientOptions)
		if err != nil {
			return fmt.Errorf("failed to connect to MongoDB: %v", err)
		}

		// Verify the connection
		if err := client.Ping(ctx, readpref.Primary()); err != nil {
			return fmt.Errorf("failed to ping MongoDB: %v", err)
		}

		m.client = client
		m.database = client.Database(m.config.Database)
		atomic.StoreInt32(&m.connected, 1)
		return nil
	}, m.options)
}

// Disconnect closes the MongoDB connection
func (m *MongoDBConnection) Disconnect(ctx context.Context) error {
	if !m.IsConnected() {
		return nil
	}

	if err := m.client.Disconnect(ctx); err != nil {
		return fmt.Errorf("failed to disconnect from MongoDB: %v", err)
	}

	atomic.StoreInt32(&m.connected, 0)
	return nil
}

// IsConnected checks if the connection is established
func (m *MongoDBConnection) IsConnected() bool {
	return atomic.LoadInt32(&m.connected) == 1
}

// Ping verifies the MongoDB connection
func (m *MongoDBConnection) Ping(ctx context.Context) error {
	if !m.IsConnected() {
		return fmt.Errorf("not connected to MongoDB")
	}
	return m.client.Ping(ctx, readpref.Primary())
}

// GetDatabase returns the MongoDB database instance
func (m *MongoDBConnection) GetDatabase() *mongo.Database {
	return m.database
}

// GetClient returns the MongoDB client instance
func (m *MongoDBConnection) GetClient() *mongo.Client {
	return m.client
}

// Collection returns a handle to a MongoDB collection
func (m *MongoDBConnection) Collection(name string) *mongo.Collection {
	return m.database.Collection(name)
}
