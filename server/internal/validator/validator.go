// internal/validator/validator.go

package validator

import (
	"fmt"
	"reflect"
	"strings"

	"github.com/go-playground/validator/v10"
)

type Validator struct {
	validator *validator.Validate
}

// NewValidator creates a new validator instance
func NewValidator() *Validator {
	v := validator.New()

	// Register custom validation tags
	v.RegisterTagNameFunc(func(fld reflect.StructField) string {
		name := strings.SplitN(fld.Tag.Get("json"), ",", 2)[0]
		if name == "-" {
			return ""
		}
		return name
	})

	// Register custom validations
	registerCustomValidations(v)

	return &Validator{
		validator: v,
	}
}

// Validate implements echo.Validator interface
func (v *Validator) Validate(i interface{}) error {
	if err := v.validator.Struct(i); err != nil {
		return formatValidationError(err)
	}
	return nil
}

// RegisterValidation registers a custom validation with the given tag
func (v *Validator) RegisterValidation(tag string, fn validator.Func, callValidationEvenIfNull ...bool) error {
	return v.validator.RegisterValidation(tag, fn, callValidationEvenIfNull...)
}

// Engine returns the underlying validator engine
func (v *Validator) Engine() interface{} {
	return v.validator
}

// ValidationError represents a validation error
type ValidationError struct {
	Field   string `json:"field"`
	Message string `json:"message"`
}

// ValidationErrors is a collection of ValidationError
type ValidationErrors []ValidationError

// Error implements the error interface
func (ve ValidationErrors) Error() string {
	var errMessages []string
	for _, err := range ve {
		errMessages = append(errMessages, fmt.Sprintf("%s: %s", err.Field, err.Message))
	}
	return strings.Join(errMessages, "; ")
}

// formatValidationError formats validator.ValidationErrors into our custom ValidationErrors
func formatValidationError(err error) error {
	if err == nil {
		return nil
	}

	var validationErrors ValidationErrors
	for _, err := range err.(validator.ValidationErrors) {
		validationErrors = append(validationErrors, ValidationError{
			Field:   err.Field(),
			Message: getErrorMessage(err),
		})
	}
	return validationErrors
}

// getErrorMessage returns a user-friendly error message for a validation error
func getErrorMessage(err validator.FieldError) string {
	switch err.Tag() {
	case "required":
		return "This field is required"
	case "email":
		return "Invalid email address"
	case "min":
		if err.Type().Kind() == reflect.String {
			return fmt.Sprintf("Must be at least %s characters long", err.Param())
		}
		return fmt.Sprintf("Must be at least %s", err.Param())
	case "max":
		if err.Type().Kind() == reflect.String {
			return fmt.Sprintf("Must be at most %s characters long", err.Param())
		}
		return fmt.Sprintf("Must be at most %s", err.Param())
	case "len":
		return fmt.Sprintf("Must be exactly %s characters long", err.Param())
	case "eq":
		return fmt.Sprintf("Must be equal to %s", err.Param())
	case "ne":
		return fmt.Sprintf("Must not be equal to %s", err.Param())
	case "gt":
		return fmt.Sprintf("Must be greater than %s", err.Param())
	case "gte":
		return fmt.Sprintf("Must be greater than or equal to %s", err.Param())
	case "lt":
		return fmt.Sprintf("Must be less than %s", err.Param())
	case "lte":
		return fmt.Sprintf("Must be less than or equal to %s", err.Param())
	case "oneof":
		return fmt.Sprintf("Must be one of: %s", err.Param())
	case "unique":
		return "All items must be unique"
	case "alphanum":
		return "Must contain only alphanumeric characters"
	case "datetime":
		return fmt.Sprintf("Must be a valid datetime in format %s", err.Param())
	default:
		return fmt.Sprintf("Failed validation for %s", err.Tag())
	}
}

// registerCustomValidations registers custom validation functions
func registerCustomValidations(v *validator.Validate) {
	// Example of a custom validation:
	// v.RegisterValidation("customtag", func(fl validator.FieldLevel) bool {
	//     return /* custom validation logic */
	// })
}
