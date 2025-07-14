// pkg/auth/handler/auth_handler.go
package handler

import (
	"net/http"

	"github.com/Siya360/take-flight/server/pkg/auth/model"
	"github.com/Siya360/take-flight/server/pkg/auth/service"
	"github.com/Siya360/take-flight/server/pkg/common"
	"github.com/labstack/echo/v4"
)

type AuthHandler struct {
	authService *service.AuthService
}

func NewAuthHandler(authService *service.AuthService) *AuthHandler {
	return &AuthHandler{
		authService: authService,
	}
}

// Login handles user authentication
func (h *AuthHandler) Login(c echo.Context) error {
	var creds model.Credentials
	if err := common.ParseJSON(c, &creds); err != nil {
		return err
	}

	token, err := h.authService.Login(c.Request().Context(), &creds)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, token)
}

// Register handles new user registration
func (h *AuthHandler) Register(c echo.Context) error {
	var registerRequest model.RegisterRequest
	if err := common.ParseJSON(c, &registerRequest); err != nil {
		return err
	}

	// Validate request
	if err := c.Validate(registerRequest); err != nil {
		return common.RespondWithError(c, common.NewAppError(
			common.ErrInvalidInput,
			"Invalid registration data",
			http.StatusBadRequest,
		))
	}

	token, err := h.authService.Register(c.Request().Context(), &registerRequest)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, token)
}

// Logout handles user logout
func (h *AuthHandler) Logout(c echo.Context) error {
	// Get user ID from context (set by auth middleware)
	userID := c.Get("user_id").(string)

	err := h.authService.Logout(c.Request().Context(), userID)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, map[string]string{
		"message": "Successfully logged out",
	})
}

// RefreshToken handles token refresh requests
func (h *AuthHandler) RefreshToken(c echo.Context) error {
	var refreshRequest struct {
		RefreshToken string `json:"refresh_token" validate:"required"`
	}

	if err := common.ParseJSON(c, &refreshRequest); err != nil {
		return err
	}

	token, err := h.authService.RefreshToken(c.Request().Context(), refreshRequest.RefreshToken)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, token)
}

// ValidateToken handles token validation requests
func (h *AuthHandler) ValidateToken(c echo.Context) error {
	// Extract token from Authorization header
	authHeader := c.Request().Header.Get("Authorization")
	if authHeader == "" {
		return common.RespondWithError(c, common.NewAppError(
			common.ErrUnauthorized,
			"No authorization token provided",
			http.StatusUnauthorized,
		))
	}

	// Remove "Bearer " prefix
	tokenString := authHeader[7:]

	claims, err := h.authService.ValidateToken(c.Request().Context(), tokenString)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, claims)
}

// GetCurrentUser returns the current authenticated user's information
func (h *AuthHandler) GetCurrentUser(c echo.Context) error {
	userID := c.Get("user_id").(string)

	user, err := h.authService.GetUserByID(c.Request().Context(), userID)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, user)
}

// UpdatePassword handles password update requests
func (h *AuthHandler) UpdatePassword(c echo.Context) error {
	var passwordUpdate struct {
		CurrentPassword string `json:"current_password" validate:"required"`
		NewPassword     string `json:"new_password" validate:"required,min=8"`
	}

	if err := common.ParseJSON(c, &passwordUpdate); err != nil {
		return err
	}

	userID := c.Get("user_id").(string)

	err := h.authService.UpdatePassword(
		c.Request().Context(),
		userID,
		passwordUpdate.CurrentPassword,
		passwordUpdate.NewPassword,
	)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, map[string]string{
		"message": "Password successfully updated",
	})
}
