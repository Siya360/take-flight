// pkg/common/utils.go
package common

import (
	"errors"
	"net/http"

	"github.com/labstack/echo/v4"
)

// RespondWithError sends an error response
func RespondWithError(c echo.Context, err error) error {
	var appErr *AppError
	if errors.As(err, &appErr) {
		return c.JSON(appErr.Code, Response{
			Success: false,
			Error:   appErr.Error(),
		})
	}

	// Handle different error types
	switch {
	case errors.Is(err, ErrNotFound):
		return c.JSON(http.StatusNotFound, Response{
			Success: false,
			Error:   err.Error(),
		})
	case errors.Is(err, ErrUnauthorized):
		return c.JSON(http.StatusUnauthorized, Response{
			Success: false,
			Error:   err.Error(),
		})
	default:
		return c.JSON(http.StatusInternalServerError, Response{
			Success: false,
			Error:   "Internal server error",
		})
	}
}

// RespondWithSuccess sends a success response
func RespondWithSuccess(c echo.Context, data interface{}) error {
	return c.JSON(http.StatusOK, Response{
		Success: true,
		Data:    data,
	})
}

// ParseJSON parses JSON from request body
func ParseJSON(c echo.Context, v interface{}) error {
	if err := c.Bind(v); err != nil {
		return NewAppError(ErrInvalidInput, "Invalid request body", http.StatusBadRequest)
	}
	return nil
}
