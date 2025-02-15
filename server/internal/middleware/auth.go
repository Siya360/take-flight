// internal/middleware/auth.go

package middleware

import (
	"net/http"
	"strings"

	"github.com/Siya360/take-flight/server/pkg/auth/model"
	"github.com/Siya360/take-flight/server/pkg/auth/service"
	"github.com/Siya360/take-flight/server/pkg/common"
	"github.com/labstack/echo/v4"
)

const (
	authHeader     = "Authorization"
	bearerPrefix   = "Bearer "
	claimsKey      = "claims"
	userIDKey      = "user_id"
	errInvalidAuth = "invalid authorization header"
)

// AuthMiddleware wraps auth service for token validation
type AuthMiddleware struct {
	authService *service.AuthService
}

// NewAuthMiddleware creates a new auth middleware
func NewAuthMiddleware(authService *service.AuthService) *AuthMiddleware {
	return &AuthMiddleware{
		authService: authService,
	}
}

// Authenticate validates JWT token and sets claims in context
func (m *AuthMiddleware) Authenticate(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		auth := c.Request().Header.Get(authHeader)
		if auth == "" || !strings.HasPrefix(auth, bearerPrefix) {
			return common.NewAppError(common.ErrUnauthorized, errInvalidAuth, http.StatusUnauthorized)
		}

		token := strings.TrimPrefix(auth, bearerPrefix)
		claims, err := m.authService.ValidateToken(c.Request().Context(), token)
		if err != nil {
			return common.RespondWithError(c, err)
		}

		// Set claims and user ID in context
		c.Set(claimsKey, claims)
		c.Set(userIDKey, claims.UserID)

		return next(c)
	}
}

// RequireAdmin ensures the authenticated user has admin role
func (m *AuthMiddleware) RequireAdmin(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		claims, ok := c.Get(claimsKey).(*model.TokenClaims)
		if !ok {
			return common.NewAppError(common.ErrUnauthorized, "no token claims found", http.StatusUnauthorized)
		}

		if claims.Role != "admin" {
			return common.NewAppError(common.ErrForbidden, "admin access required", http.StatusForbidden)
		}

		return next(c)
	}
}

// RequireRole ensures the authenticated user has the specified role
func (m *AuthMiddleware) RequireRole(role string) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			claims, ok := c.Get(claimsKey).(*model.TokenClaims)
			if !ok {
				return common.NewAppError(common.ErrUnauthorized, "no token claims found", http.StatusUnauthorized)
			}

			if claims.Role != role {
				return common.NewAppError(common.ErrForbidden, "required role: "+role, http.StatusForbidden)
			}

			return next(c)
		}
	}
}

// GetUserID retrieves the authenticated user ID from context
func GetUserID(c echo.Context) string {
	userID, _ := c.Get(userIDKey).(string)
	return userID
}

// GetClaims retrieves the token claims from context
func GetClaims(c echo.Context) *model.TokenClaims {
	claims, _ := c.Get(claimsKey).(*model.TokenClaims)
	return claims
}
