// cmd/api/routes.go

package main

import (
	"github.com/labstack/echo/v4"
	echomw "github.com/labstack/echo/v4/middleware"

	"github.com/Siya360/take-flight/server/internal/middleware"
	"github.com/Siya360/take-flight/server/pkg/admin/handler"
	"github.com/Siya360/take-flight/server/pkg/admin/service"
	authhandler "github.com/Siya360/take-flight/server/pkg/auth/handler"
	authservice "github.com/Siya360/take-flight/server/pkg/auth/service"
	bookinghandler "github.com/Siya360/take-flight/server/pkg/bookings/handler"
	bookingservice "github.com/Siya360/take-flight/server/pkg/bookings/service"
	flighthandler "github.com/Siya360/take-flight/server/pkg/flights/handler"
	flightservice "github.com/Siya360/take-flight/server/pkg/flights/service"
	userhandler "github.com/Siya360/take-flight/server/pkg/users/handler"
	userservice "github.com/Siya360/take-flight/server/pkg/users/service"
)

// Config represents the server configuration
type Config struct {
	JWT struct {
		Secret string
	}
}

// Server represents the API server
type Server struct {
	echo           *echo.Echo
	config         *Config
	authService    *authservice.AuthService
	userService    *userservice.UserService
	flightService  *flightservice.FlightService
	bookingService *bookingservice.BookingService
	adminService   *service.AdminService
	authMiddleware *middleware.AuthMiddleware
}

// NewServer creates a new server instance
func NewServer(
	config *Config,
	authService *authservice.AuthService,
	userService *userservice.UserService,
	flightService *flightservice.FlightService,
	bookingService *bookingservice.BookingService,
	adminService *service.AdminService,
) *Server {
	e := echo.New()

	// Configure middleware
	e.Use(echomw.Logger())
	e.Use(echomw.Recover())
	e.Use(echomw.CORS())

	authMiddleware := middleware.NewAuthMiddleware(authService)

	return &Server{
		echo:           e,
		config:         config,
		authService:    authService,
		userService:    userService,
		flightService:  flightService,
		bookingService: bookingService,
		adminService:   adminService,
		authMiddleware: authMiddleware,
	}
}

// Start initializes and starts the server
func (s *Server) Start(address string) error {
	s.setupRoutes()
	return s.echo.Start(address)
}

func (s *Server) setupRoutes() {
	// Auth routes
	authHandler := authhandler.NewAuthHandler(s.authService)
	authGroup := s.echo.Group("/api/auth")
	{
		// Public routes
		authGroup.POST("/login", authHandler.Login)
		authGroup.POST("/register", authHandler.Register)
		authGroup.POST("/refresh-token", authHandler.RefreshToken)

		// Protected routes
		authGroup.Use(s.authMiddleware.Authenticate)
		authGroup.POST("/logout", authHandler.Logout)
	}

	// User routes
	userHandler := userhandler.NewUserHandler(s.userService)
	userGroup := s.echo.Group("/api/users", s.authMiddleware.Authenticate)
	{
		userGroup.GET("", userHandler.ListUsers)
		userGroup.GET("/:id", userHandler.GetUser)
		userGroup.PUT("/:id", userHandler.UpdateUser)
		userGroup.DELETE("/:id", userHandler.DeleteUser)
	}

	// Flight routes
	flightHandler := flighthandler.NewFlightHandler(s.flightService)
	flightGroup := s.echo.Group("/api/flights")
	{
		// Public routes
		flightGroup.GET("", flightHandler.SearchFlights)
		flightGroup.GET("/:id", flightHandler.GetFlight)

		// Protected routes
		adminFlights := flightGroup.Group("", s.authMiddleware.RequireAdmin)
		adminFlights.POST("", flightHandler.CreateFlight)
		adminFlights.PUT("/:id", flightHandler.UpdateFlight)
		adminFlights.DELETE("/:id", flightHandler.DeleteFlight)
	}

	// Booking routes
	bookingHandler := bookinghandler.NewBookingHandler(s.bookingService)
	bookingGroup := s.echo.Group("/api/bookings", s.authMiddleware.Authenticate)
	{
		bookingGroup.POST("", bookingHandler.CreateBooking)
		bookingGroup.GET("", bookingHandler.SearchBookings)
		bookingGroup.GET("/:id", bookingHandler.GetBooking)
		bookingGroup.PUT("/:id", bookingHandler.UpdateBooking)
		bookingGroup.POST("/:id/cancel", bookingHandler.CancelBooking)
	}

	// Admin routes
	adminHandler := handler.NewAdminHandler(s.adminService)
	adminGroup := s.echo.Group("/api/admin", s.authMiddleware.RequireAdmin)
	{
		adminGroup.GET("/dashboard", adminHandler.GetDashboardStats)
		adminGroup.PUT("/config", adminHandler.UpdateSystemConfig)
		adminGroup.GET("/revenue", adminHandler.GetRevenueStats)
		adminGroup.GET("/metrics", adminHandler.GetSystemMetrics)
		adminGroup.GET("/activities", adminHandler.GetAdminActivities)
		adminGroup.PUT("/notifications", adminHandler.UpdateNotificationSettings)
	}
}
