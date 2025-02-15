// internal/cache/client.go

package cache

import (
	"context"
	"encoding/json"
	"time"

	"github.com/go-redis/redis/v8"
)

// CacheClient defines the interface for cache operations
type CacheClient interface {
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
	Get(ctx context.Context, key string) (string, error)
	Del(ctx context.Context, key string) error
	Exists(ctx context.Context, key string) (bool, error)
}

// RedisClient implements CacheClient using Redis
type RedisClient struct {
	client *redis.Client
}

// NewRedisClient creates a new Redis cache client
func NewRedisClient(client *redis.Client) *RedisClient {
	return &RedisClient{
		client: client,
	}
}

// Set stores a value in the cache with the specified expiration
func (c *RedisClient) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	var strValue string

	switch v := value.(type) {
	case string:
		strValue = v
	case []byte:
		strValue = string(v)
	default:
		bytes, err := json.Marshal(value)
		if err != nil {
			return err
		}
		strValue = string(bytes)
	}

	return c.client.Set(ctx, key, strValue, expiration).Err()
}

// Get retrieves a value from the cache
func (c *RedisClient) Get(ctx context.Context, key string) (string, error) {
	return c.client.Get(ctx, key).Result()
}

// Del removes a value from the cache
func (c *RedisClient) Del(ctx context.Context, key string) error {
	return c.client.Del(ctx, key).Err()
}

// Exists checks if a key exists in the cache
func (c *RedisClient) Exists(ctx context.Context, key string) (bool, error) {
	result, err := c.client.Exists(ctx, key).Result()
	return result > 0, err
}

// MockCacheClient implements CacheClient for testing
type MockCacheClient struct {
	data map[string]string
}

// NewMockCacheClient creates a new mock cache client
func NewMockCacheClient() *MockCacheClient {
	return &MockCacheClient{
		data: make(map[string]string),
	}
}

func (c *MockCacheClient) Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error {
	var strValue string

	switch v := value.(type) {
	case string:
		strValue = v
	case []byte:
		strValue = string(v)
	default:
		bytes, err := json.Marshal(value)
		if err != nil {
			return err
		}
		strValue = string(bytes)
	}

	c.data[key] = strValue
	return nil
}

func (c *MockCacheClient) Get(ctx context.Context, key string) (string, error) {
	if value, ok := c.data[key]; ok {
		return value, nil
	}
	return "", redis.Nil
}

func (c *MockCacheClient) Del(ctx context.Context, key string) error {
	delete(c.data, key)
	return nil
}

func (c *MockCacheClient) Exists(ctx context.Context, key string) (bool, error) {
	_, exists := c.data[key]
	return exists, nil
}
