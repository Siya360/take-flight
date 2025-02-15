// internal/database/connection.go

package database

import (
	"context"
	"fmt"
	"time"
)

// Config holds database configuration
type Config struct {
	Host         string
	Port         int
	Username     string
	Password     string
	Database     string
	MaxPoolSize  int
	ConnTimeout  time.Duration
	WriteTimeout time.Duration
	ReadTimeout  time.Duration
}

// ConnectionOptions holds common database connection options
type ConnectionOptions struct {
	MaxRetries  int
	RetryDelay  time.Duration
	DialTimeout time.Duration
}

// Connection defines the interface for database connections
type Connection interface {
	Connect(ctx context.Context) error
	Disconnect(ctx context.Context) error
	IsConnected() bool
	Ping(ctx context.Context) error
}

// DefaultConnectionOptions returns default connection options
func DefaultConnectionOptions() *ConnectionOptions {
	return &ConnectionOptions{
		MaxRetries:  3,
		RetryDelay:  time.Second * 5,
		DialTimeout: time.Second * 10,
	}
}

// ValidateConfig validates the database configuration
func ValidateConfig(cfg *Config) error {
	if cfg.Host == "" {
		return fmt.Errorf("database host is required")
	}
	if cfg.Port <= 0 {
		return fmt.Errorf("invalid database port")
	}
	if cfg.Database == "" {
		return fmt.Errorf("database name is required")
	}
	if cfg.MaxPoolSize <= 0 {
		cfg.MaxPoolSize = 10 // Set default pool size
	}
	if cfg.ConnTimeout == 0 {
		cfg.ConnTimeout = time.Second * 30 // Set default connection timeout
	}
	if cfg.WriteTimeout == 0 {
		cfg.WriteTimeout = time.Second * 30 // Set default write timeout
	}
	if cfg.ReadTimeout == 0 {
		cfg.ReadTimeout = time.Second * 30 // Set default read timeout
	}
	return nil
}

// RetryWithBackoff implements a retry mechanism with exponential backoff
func RetryWithBackoff(ctx context.Context, operation func() error, options *ConnectionOptions) error {
	var err error
	for i := 0; i < options.MaxRetries; i++ {
		select {
		case <-ctx.Done():
			return ctx.Err()
		default:
			if err = operation(); err == nil {
				return nil
			}
			if i < options.MaxRetries-1 {
				delay := options.RetryDelay * time.Duration(i+1)
				time.Sleep(delay)
			}
		}
	}
	return fmt.Errorf("operation failed after %d retries: %v", options.MaxRetries, err)
}
