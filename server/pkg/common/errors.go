// pkg/common/errors.go
package common

import "errors"

var (
	// Common errors
	ErrInvalidInput   = errors.New("invalid input")
	ErrNotFound       = errors.New("resource not found")
	ErrUnauthorized   = errors.New("unauthorized access")
	ErrForbidden      = errors.New("forbidden access")
	ErrInternalServer = errors.New("internal server error")

	// Auth specific errors
	ErrInvalidCredentials = errors.New("invalid credentials")
	ErrTokenExpired       = errors.New("token has expired")
	ErrInvalidToken       = errors.New("invalid token")

	// Business logic errors
	ErrFlightNotAvailable = errors.New("flight not available")
	ErrBookingNotFound    = errors.New("booking not found")
	ErrInsufficientSeats  = errors.New("insufficient seats available")
)

// AppError represents an application error
type AppError struct {
	Err     error
	Message string
	Code    int
}

func (e *AppError) Error() string {
	if e.Message != "" {
		return e.Message
	}
	return e.Err.Error()
}

// NewAppError creates a new application error
func NewAppError(err error, message string, code int) *AppError {
	return &AppError{
		Err:     err,
		Message: message,
		Code:    code,
	}
}
