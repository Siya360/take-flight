// internal/middleware/cors.go

package middleware

import (
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

// CORSConfig defines the config for CORS middleware
type CORSConfig struct {
	AllowOrigins     []string
	AllowMethods     []string
	AllowHeaders     []string
	AllowCredentials bool
	MaxAge           int
}

// DefaultCORSConfig returns the default CORS configuration
func DefaultCORSConfig() *CORSConfig {
	return &CORSConfig{
		AllowOrigins: []string{"*"},
		AllowMethods: []string{
			http.MethodGet,
			http.MethodHead,
			http.MethodPut,
			http.MethodPatch,
			http.MethodPost,
			http.MethodDelete,
			http.MethodOptions,
		},
		AllowHeaders: []string{
			"Accept",
			"Authorization",
			"Content-Type",
			"X-CSRF-Token",
			"X-Requested-With",
		},
		AllowCredentials: true,
		MaxAge:           86400, // 24 hours
	}
}

// CORS returns a new CORS middleware
func CORS(config *CORSConfig) echo.MiddlewareFunc {
	if config == nil {
		config = DefaultCORSConfig()
	}

	allowOrigins := strings.Join(config.AllowOrigins, ",")
	allowMethods := strings.Join(config.AllowMethods, ",")
	allowHeaders := strings.Join(config.AllowHeaders, ",")
	maxAge := config.MaxAge

	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			req := c.Request()
			res := c.Response()

			// Set CORS headers
			res.Header().Set("Access-Control-Allow-Origin", allowOrigins)
			res.Header().Set("Access-Control-Allow-Methods", allowMethods)
			res.Header().Set("Access-Control-Allow-Headers", allowHeaders)
			res.Header().Set("Access-Control-Max-Age", string(maxAge))

			if config.AllowCredentials {
				res.Header().Set("Access-Control-Allow-Credentials", "true")
			}

			// Handle preflight requests
			if req.Method == http.MethodOptions {
				return c.NoContent(http.StatusNoContent)
			}

			return next(c)
		}
	}
}

// CORSWithConfig returns a CORS middleware with config
func CORSWithConfig(config *CORSConfig) echo.MiddlewareFunc {
	return CORS(config)
}
