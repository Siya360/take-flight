// internal/database/postgres.go

package database

import (
	"context"
	"database/sql"
	"fmt"
	"sync/atomic"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

const (
	errGetSQLDB = "failed to get underlying *sql.DB: %v"
)

// PostgresConnection implements Connection for PostgreSQL using GORM
type PostgresConnection struct {
	db        *gorm.DB
	config    *Config
	options   *ConnectionOptions
	connected int32
}

// NewPostgresConnection creates a new PostgreSQL connection
func NewPostgresConnection(cfg *Config, opts *ConnectionOptions) (*PostgresConnection, error) {
	if err := ValidateConfig(cfg); err != nil {
		return nil, err
	}
	if opts == nil {
		opts = DefaultConnectionOptions()
	}
	return &PostgresConnection{
		config:  cfg,
		options: opts,
	}, nil
}

// Connect establishes a connection to PostgreSQL
func (p *PostgresConnection) Connect(ctx context.Context) error {
	if p.IsConnected() {
		return nil
	}

	dsn := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		p.config.Host,
		p.config.Port,
		p.config.Username,
		p.config.Password,
		p.config.Database,
	)

	return RetryWithBackoff(ctx, func() error {
		config := &gorm.Config{}
		db, err := gorm.Open(postgres.Open(dsn), config)
		if err != nil {
			return fmt.Errorf("failed to connect to PostgreSQL: %v", err)
		}

		sqlDB, err := db.DB()
		if err != nil {
			return fmt.Errorf(errGetSQLDB, err)
		}

		// Configure connection pool
		sqlDB.SetMaxIdleConns(10)
		sqlDB.SetMaxOpenConns(p.config.MaxPoolSize)
		sqlDB.SetConnMaxLifetime(time.Hour)

		// Verify the connection
		if err := sqlDB.PingContext(ctx); err != nil {
			return fmt.Errorf("failed to ping PostgreSQL: %v", err)
		}

		p.db = db
		atomic.StoreInt32(&p.connected, 1)
		return nil
	}, p.options)
}

// Disconnect closes the PostgreSQL connection
func (p *PostgresConnection) Disconnect(ctx context.Context) error {
	if !p.IsConnected() {
		return nil
	}

	sqlDB, err := p.db.DB()
	if err != nil {
		return fmt.Errorf(errGetSQLDB, err)
	}

	if err := sqlDB.Close(); err != nil {
		return fmt.Errorf("failed to disconnect from PostgreSQL: %v", err)
	}

	atomic.StoreInt32(&p.connected, 0)
	return nil
}

// IsConnected checks if the connection is established
func (p *PostgresConnection) IsConnected() bool {
	return atomic.LoadInt32(&p.connected) == 1
}

// Ping verifies the PostgreSQL connection
func (p *PostgresConnection) Ping(ctx context.Context) error {
	if !p.IsConnected() {
		return fmt.Errorf("not connected to PostgreSQL")
	}

	sqlDB, err := p.db.DB()
	if err != nil {
		return fmt.Errorf(errGetSQLDB, err)
	}

	return sqlDB.PingContext(ctx)
}

// GetDB returns the GORM database instance
func (p *PostgresConnection) GetDB() *gorm.DB {
	return p.db
}

// WithTransaction executes operations within a transaction
func (p *PostgresConnection) WithTransaction(ctx context.Context, fn func(tx *gorm.DB) error) error {
	tx := p.db.WithContext(ctx).Begin()
	if tx.Error != nil {
		return fmt.Errorf("failed to begin transaction: %v", tx.Error)
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			panic(r) // Re-throw panic after rollback
		}
	}()

	if err := fn(tx); err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to commit transaction: %v", err)
	}

	return nil
}

// Migrate runs database migrations
func (p *PostgresConnection) Migrate(models ...interface{}) error {
	return p.db.AutoMigrate(models...)
}

// Raw executes a raw SQL query
func (p *PostgresConnection) Raw(sql string, values ...interface{}) *gorm.DB {
	return p.db.Raw(sql, values...)
}

// Exec executes SQL expressions
func (p *PostgresConnection) Exec(sql string, values ...interface{}) *gorm.DB {
	return p.db.Exec(sql, values...)
}

// RunInTransaction executes the given function in a transaction with the given options
func (p *PostgresConnection) RunInTransaction(ctx context.Context, opts *sql.TxOptions, fn func(tx *gorm.DB) error) error {
	tx := p.db.WithContext(ctx).Begin(opts)
	if tx.Error != nil {
		return fmt.Errorf("failed to begin transaction: %v", tx.Error)
	}

	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
			panic(r)
		}
	}()

	if err := fn(tx); err != nil {
		tx.Rollback()
		return err
	}

	if err := tx.Commit().Error; err != nil {
		tx.Rollback()
		return fmt.Errorf("failed to commit transaction: %v", err)
	}

	return nil
}

// Model create a new relation with given model
func (p *PostgresConnection) Model(value interface{}) *gorm.DB {
	return p.db.Model(value)
}

// Table create a new relation with given table name
func (p *PostgresConnection) Table(name string) *gorm.DB {
	return p.db.Table(name)
}
