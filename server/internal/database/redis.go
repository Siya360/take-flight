// internal/database/redis.go

package database

import (
	"context"
	"fmt"
	"sync/atomic"

	"github.com/go-redis/redis/v8"
)

// RedisConnection implements Connection for Redis
type RedisConnection struct {
	client    *redis.Client
	config    *Config
	options   *ConnectionOptions
	connected int32
}

// NewRedisConnection creates a new Redis connection
func NewRedisConnection(cfg *Config, opts *ConnectionOptions) (*RedisConnection, error) {
	if err := ValidateConfig(cfg); err != nil {
		return nil, err
	}
	if opts == nil {
		opts = DefaultConnectionOptions()
	}
	return &RedisConnection{
		config:  cfg,
		options: opts,
	}, nil
}

// Connect establishes a connection to Redis
func (r *RedisConnection) Connect(ctx context.Context) error {
	if r.IsConnected() {
		return nil
	}

	return RetryWithBackoff(ctx, func() error {
		r.client = redis.NewClient(&redis.Options{
			Addr:        fmt.Sprintf("%s:%d", r.config.Host, r.config.Port),
			Username:    r.config.Username,
			Password:    r.config.Password,
			DB:          0, // Default DB
			PoolSize:    r.config.MaxPoolSize,
			ReadTimeout: r.config.ReadTimeout,
			DialTimeout: r.config.ConnTimeout,
		})

		// Verify the connection
		if err := r.client.Ping(ctx).Err(); err != nil {
			return fmt.Errorf("failed to ping Redis: %v", err)
		}

		atomic.StoreInt32(&r.connected, 1)
		return nil
	}, r.options)
}

// Disconnect closes the Redis connection
func (r *RedisConnection) Disconnect(ctx context.Context) error {
	if !r.IsConnected() {
		return nil
	}

	if err := r.client.Close(); err != nil {
		return fmt.Errorf("failed to disconnect from Redis: %v", err)
	}

	atomic.StoreInt32(&r.connected, 0)
	return nil
}

// IsConnected checks if the connection is established
func (r *RedisConnection) IsConnected() bool {
	return atomic.LoadInt32(&r.connected) == 1
}

// Ping verifies the Redis connection
func (r *RedisConnection) Ping(ctx context.Context) error {
	if !r.IsConnected() {
		return fmt.Errorf("not connected to Redis")
	}
	return r.client.Ping(ctx).Err()
}

// GetClient returns the Redis client instance
func (r *RedisConnection) GetClient() *redis.Client {
	return r.client
}
