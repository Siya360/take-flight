// cmd/api/server.go

package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/go-redis/redis/v8"
	"github.com/labstack/echo/v4"
	"go.mongodb.org/mongo-driver/mongo"
	"gopkg.in/yaml.v3"

	"github.com/Siya360/take-flight/server/internal/cache"
	"github.com/Siya360/take-flight/server/internal/database"
	adminmongo "github.com/Siya360/take-flight/server/pkg/admin/repository/mongodb"
	adminservice "github.com/Siya360/take-flight/server/pkg/admin/service"
	authmongo "github.com/Siya360/take-flight/server/pkg/auth/repository/mongodb"
	authservice "github.com/Siya360/take-flight/server/pkg/auth/service"
	bookingmongo "github.com/Siya360/take-flight/server/pkg/bookings/repository/mongodb"
	bookingservice "github.com/Siya360/take-flight/server/pkg/bookings/service"
	"github.com/Siya360/take-flight/server/pkg/common"
	flightmongo "github.com/Siya360/take-flight/server/pkg/flights/repository/mongodb"
	flightservice "github.com/Siya360/take-flight/server/pkg/flights/service"
	usermongo "github.com/Siya360/take-flight/server/pkg/users/repository/mongodb"
	userservice "github.com/Siya360/take-flight/server/pkg/users/service"
)

// AppConfig holds the application configuration
type AppConfig struct {
	Server struct {
		Port int    `yaml:"port"`
		Host string `yaml:"host"`
	} `yaml:"server"`
	MongoDB struct {
		URI      string `yaml:"uri"`
		Database string `yaml:"database"`
	} `yaml:"mongodb"`
	Redis struct {
		Host     string `yaml:"host"`
		Port     int    `yaml:"port"`
		Password string `yaml:"password"`
		DB       int    `yaml:"db"`
	} `yaml:"redis"`
	JWT struct {
		Secret        string        `yaml:"secret"`
		ExpireHours   int           `yaml:"expireHours"`
		RefreshSecret string        `yaml:"refreshSecret"`
		RefreshTTL    time.Duration `yaml:"refreshTTL"`
	} `yaml:"jwt"`
}

// Application represents the main application structure
type Application struct {
	config         *AppConfig
	mongoClient    *mongo.Client
	redisClient    *redis.Client
	cacheClient    cache.CacheClient
	server         *Server
	echo           *echo.Echo
	shutdownSignal chan os.Signal
}

// NewApplication creates a new application instance
func NewApplication(configPath string) (*Application, error) {
	config, err := loadConfig(configPath)
	if err != nil {
		return nil, fmt.Errorf("failed to load config: %v", err)
	}

	app := &Application{
		config:         config,
		shutdownSignal: make(chan os.Signal, 1),
	}

	if err := app.initializeDependencies(); err != nil {
		return nil, err
	}

	if err := app.setupServer(); err != nil {
		return nil, err
	}

	return app, nil
}

// loadConfig loads the application configuration from a YAML file
func loadConfig(path string) (*AppConfig, error) {
	file, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("failed to read config file: %v", err)
	}

	var config AppConfig
	if err := yaml.Unmarshal(file, &config); err != nil {
		return nil, fmt.Errorf("failed to parse config file: %v", err)
	}

	return &config, nil
}

// initializeDependencies sets up all required service dependencies
func (app *Application) initializeDependencies() error {
	// Initialize MongoDB connection
	mongoConfig := &database.Config{
		Host:     app.config.MongoDB.URI,
		Database: app.config.MongoDB.Database,
	}
	mongoConn, err := database.NewMongoDBConnection(mongoConfig, nil)
	if err != nil {
		return fmt.Errorf("failed to create MongoDB connection: %v", err)
	}

	if err := mongoConn.Connect(context.Background()); err != nil {
		return fmt.Errorf("failed to connect to MongoDB: %v", err)
	}

	app.mongoClient = mongoConn.GetClient()

	// Initialize Redis connection
	redisConfig := &database.Config{
		Host:     app.config.Redis.Host,
		Port:     app.config.Redis.Port,
		Password: app.config.Redis.Password,
	}
	redisConn, err := database.NewRedisConnection(redisConfig, nil)
	if err != nil {
		return fmt.Errorf("failed to create Redis connection: %v", err)
	}

	if err := redisConn.Connect(context.Background()); err != nil {
		return fmt.Errorf("failed to connect to Redis: %v", err)
	}

	app.redisClient = redisConn.GetClient()
	app.cacheClient = cache.NewRedisClient(app.redisClient)

	return nil
}

// setupServer initializes the HTTP server with all required services
func (app *Application) setupServer() error {
	db := app.mongoClient.Database(app.config.MongoDB.Database)

	// Initialize repositories
	authRepo := authmongo.NewMongoAuthRepository(db)
	userRepo := usermongo.NewMongoUserRepository(db)
	flightRepo := flightmongo.NewMongoFlightRepository(db)
	bookingRepo := bookingmongo.NewMongoBookingRepository(db)
	adminRepo := adminmongo.NewMongoAdminRepository(db)

	// Create auth service config
	authConfig := &common.Config{
		JWT: common.JWTConfig{
			Secret:        app.config.JWT.Secret,
			ExpireHours:   app.config.JWT.ExpireHours,
			RefreshSecret: app.config.JWT.RefreshSecret,
		},
	}

	// Initialize services
	authService := authservice.NewAuthService(authConfig, authRepo, app.cacheClient)
	userService := userservice.NewUserService(userRepo)
	flightService := flightservice.NewFlightService(flightRepo)
	bookingService := bookingservice.NewBookingService(bookingRepo, flightService, app.cacheClient)
	adminService := adminservice.NewAdminService(adminRepo, adminRepo, app.cacheClient)

	// Initialize server
	serverConfig := &Config{
		JWT: struct{ Secret string }{
			Secret: app.config.JWT.Secret,
		},
	}

	app.server = NewServer(
		serverConfig,
		authService,
		userService,
		flightService,
		bookingService,
		adminService,
	)

	return nil
}

// Start begins the application
func (app *Application) Start() error {
	signal.Notify(app.shutdownSignal, os.Interrupt)

	go func() {
		addr := fmt.Sprintf("%s:%d", app.config.Server.Host, app.config.Server.Port)
		if err := app.server.Start(addr); err != nil && err != http.ErrServerClosed {
			log.Fatalf("server error: %v", err)
		}
	}()

	<-app.shutdownSignal
	return app.Shutdown()
}

// Shutdown gracefully stops the application
func (app *Application) Shutdown() error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	if err := app.server.echo.Shutdown(ctx); err != nil {
		return fmt.Errorf("server shutdown error: %v", err)
	}

	if err := app.mongoClient.Disconnect(ctx); err != nil {
		return fmt.Errorf("MongoDB disconnect error: %v", err)
	}

	if err := app.redisClient.Close(); err != nil {
		return fmt.Errorf("Redis disconnect error: %v", err)
	}

	return nil
}
