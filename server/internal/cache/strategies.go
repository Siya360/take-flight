// internal/cache/strategies.go

package cache

import (
	"context"
	"time"
)

// CacheStrategy defines how caching behavior should be implemented
type CacheStrategy interface {
	Get(ctx context.Context, key string, fetch func() (interface{}, error)) (interface{}, error)
}

// SimpleCache implements a basic cache-aside strategy
type SimpleCache struct {
	client CacheClient
	ttl    time.Duration
}

// NewSimpleCache creates a new simple cache strategy
func NewSimpleCache(client CacheClient, ttl time.Duration) *SimpleCache {
	return &SimpleCache{
		client: client,
		ttl:    ttl,
	}
}

// Get retrieves an item from cache or calls fetch function if not found
func (c *SimpleCache) Get(ctx context.Context, key string, fetch func() (interface{}, error)) (interface{}, error) {
	// Try to get from cache first
	value, err := c.client.Get(ctx, key)
	if err == nil {
		return value, nil
	}

	// If not in cache, fetch it
	data, err := fetch()
	if err != nil {
		return nil, err
	}

	// Store in cache for next time
	if err := c.client.Set(ctx, key, data, c.ttl); err != nil {
		return data, err // Return data even if caching fails
	}

	return data, nil
}

// WriteThrough implements a write-through caching strategy
type WriteThrough struct {
	client CacheClient
	ttl    time.Duration
}

// NewWriteThrough creates a new write-through cache strategy
func NewWriteThrough(client CacheClient, ttl time.Duration) *WriteThrough {
	return &WriteThrough{
		client: client,
		ttl:    ttl,
	}
}

// Get retrieves an item and updates cache
func (c *WriteThrough) Get(ctx context.Context, key string, fetch func() (interface{}, error)) (interface{}, error) {
	// Always fetch fresh data
	data, err := fetch()
	if err != nil {
		return nil, err
	}

	// Update cache
	if err := c.client.Set(ctx, key, data, c.ttl); err != nil {
		return data, err // Return data even if caching fails
	}

	return data, nil
}

// SlidingCache implements a sliding window cache strategy
type SlidingCache struct {
	client CacheClient
	ttl    time.Duration
}

// NewSlidingCache creates a new sliding window cache strategy
func NewSlidingCache(client CacheClient, ttl time.Duration) *SlidingCache {
	return &SlidingCache{
		client: client,
		ttl:    ttl,
	}
}

// Get retrieves an item and extends TTL if found
func (c *SlidingCache) Get(ctx context.Context, key string, fetch func() (interface{}, error)) (interface{}, error) {
	// Try to get from cache
	value, err := c.client.Get(ctx, key)
	if err == nil {
		// Extend TTL
		if err := c.client.Set(ctx, key, value, c.ttl); err != nil {
			return value, err
		}
		return value, nil
	}

	// If not in cache, fetch it
	data, err := fetch()
	if err != nil {
		return nil, err
	}

	// Store in cache
	if err := c.client.Set(ctx, key, data, c.ttl); err != nil {
		return data, err
	}

	return data, nil
}

// CacheBuilder helps construct cache strategies
type CacheBuilder struct {
	client CacheClient
	ttl    time.Duration
}

// NewCacheBuilder creates a new cache builder
func NewCacheBuilder(client CacheClient) *CacheBuilder {
	return &CacheBuilder{
		client: client,
		ttl:    5 * time.Minute, // Default TTL
	}
}

// WithTTL sets the TTL for the cache strategy
func (b *CacheBuilder) WithTTL(ttl time.Duration) *CacheBuilder {
	b.ttl = ttl
	return b
}

// BuildSimple creates a simple cache strategy
func (b *CacheBuilder) BuildSimple() *SimpleCache {
	return NewSimpleCache(b.client, b.ttl)
}

// BuildWriteThrough creates a write-through cache strategy
func (b *CacheBuilder) BuildWriteThrough() *WriteThrough {
	return NewWriteThrough(b.client, b.ttl)
}

// BuildSliding creates a sliding window cache strategy
func (b *CacheBuilder) BuildSliding() *SlidingCache {
	return NewSlidingCache(b.client, b.ttl)
}
