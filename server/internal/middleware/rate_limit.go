// internal/middleware/rate_limit.go

package middleware

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/labstack/echo/v4"
)

const (
	ErrTooManyRequests = "TOO_MANY_REQUESTS"
)

// RateLimitConfig defines the config for rate limiting
type RateLimitConfig struct {
	Redis       *redis.Client
	Limit       int
	Window      time.Duration
	KeyFunc     func(c echo.Context) string
	ExcludeFunc func(c echo.Context) bool
}

// DefaultRateLimitConfig returns the default rate limit configuration
func DefaultRateLimitConfig() *RateLimitConfig {
	return &RateLimitConfig{
		Limit:  100,
		Window: time.Hour,
		KeyFunc: func(c echo.Context) string {
			return fmt.Sprintf("ratelimit:%s", c.RealIP())
		},
		ExcludeFunc: func(c echo.Context) bool {
			return false
		},
	}
}

// RateLimit returns a rate limiting middleware
func RateLimit(config *RateLimitConfig) echo.MiddlewareFunc {
	if config == nil {
		config = DefaultRateLimitConfig()
	}

	if config.Redis == nil {
		panic("redis client is required for rate limiting")
	}

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			if config.ExcludeFunc(c) {
				return next(c)
			}

			key := config.KeyFunc(c)
			ctx := context.Background()

			// Check rate limit
			if exceeded, err := checkRateLimit(ctx, config, key); err != nil {
				c.Logger().Error("rate limit error:", err)
				return next(c)
			} else if exceeded {
				return handleExceededLimit(ctx, config, c, key)
			}

			// Update rate limit counters
			if err := updateRateLimit(ctx, config, key, c); err != nil {
				c.Logger().Error("rate limit error:", err)
			}

			return next(c)
		}
	}
}

func checkRateLimit(ctx context.Context, config *RateLimitConfig, key string) (bool, error) {
	count, err := config.Redis.Get(ctx, key).Int()
	if err != nil && err != redis.Nil {
		return false, err
	}
	return count >= config.Limit, nil
}

func handleExceededLimit(ctx context.Context, config *RateLimitConfig, c echo.Context, key string) error {
	retryAfter := config.Redis.TTL(ctx, key).Val()
	c.Response().Header().Set("Retry-After", fmt.Sprintf("%d", int(retryAfter.Seconds())))
	return echo.NewHTTPError(
		http.StatusTooManyRequests,
		fmt.Sprintf("rate limit exceeded. try again in %v", retryAfter),
	)
}

func updateRateLimit(ctx context.Context, config *RateLimitConfig, key string, c echo.Context) error {
	pipe := config.Redis.Pipeline()
	incr := pipe.Incr(ctx, key)
	pipe.Expire(ctx, key, config.Window)

	if _, err := pipe.Exec(ctx); err != nil {
		return err
	}

	remaining := config.Limit - int(incr.Val())
	setRateLimitHeaders(c, config.Limit, remaining, config.Window)
	return nil
}

func setRateLimitHeaders(c echo.Context, limit, remaining int, window time.Duration) {
	c.Response().Header().Set("X-RateLimit-Limit", fmt.Sprintf("%d", limit))
	c.Response().Header().Set("X-RateLimit-Remaining", fmt.Sprintf("%d", remaining))
	c.Response().Header().Set("X-RateLimit-Reset", fmt.Sprintf("%d", time.Now().Add(window).Unix()))
}
