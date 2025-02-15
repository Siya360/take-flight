// internal/validator/schemas.go

package validator

import (
	"regexp"
	"time"

	"github.com/go-playground/validator/v10"
)

var (
	passwordRegex = regexp.MustCompile(`^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};:'",.<>/?]{8,}$`)
	phoneRegex    = regexp.MustCompile(`^\+?[1-9]\d{1,14}$`)
)

// RegisterSchemas registers all validation schemas
func RegisterSchemas(v *validator.Validate) {
	// Password validation
	v.RegisterValidation("password", validatePassword)

	// Phone number validation
	v.RegisterValidation("phone", validatePhone)

	// Future date validation
	v.RegisterValidation("future", validateFutureDate)

	// Past date validation
	v.RegisterValidation("past", validatePastDate)

	// URL validation with custom options
	v.RegisterValidation("url", validateURL)

	// Currency validation
	v.RegisterValidation("currency", validateCurrency)

	// Time zone validation
	v.RegisterValidation("timezone", validateTimeZone)

	// Credit card validation
	v.RegisterValidation("creditcard", validateCreditCard)
}

// Password validation
func validatePassword(fl validator.FieldLevel) bool {
	return passwordRegex.MatchString(fl.Field().String())
}

// Phone number validation (E.164 format)
func validatePhone(fl validator.FieldLevel) bool {
	return phoneRegex.MatchString(fl.Field().String())
}

// Future date validation
func validateFutureDate(fl validator.FieldLevel) bool {
	t, ok := fl.Field().Interface().(time.Time)
	if !ok {
		return false
	}
	return t.After(time.Now())
}

// Past date validation
func validatePastDate(fl validator.FieldLevel) bool {
	t, ok := fl.Field().Interface().(time.Time)
	if !ok {
		return false
	}
	return t.Before(time.Now())
}

// URL validation with custom options
func validateURL(fl validator.FieldLevel) bool {
	// Implement URL validation logic
	// Could use url.Parse() or a regex pattern
	return true
}

// Currency validation (ISO 4217)
func validateCurrency(fl validator.FieldLevel) bool {
	// Implement currency code validation
	currencies := map[string]bool{
		"USD": true,
		"EUR": true,
		"GBP": true,
		"JPY": true,
		// Add more currencies as needed
	}
	return currencies[fl.Field().String()]
}

// Time zone validation
func validateTimeZone(fl validator.FieldLevel) bool {
	// Implement time zone validation
	_, err := time.LoadLocation(fl.Field().String())
	return err == nil
}

// Credit card validation
func validateCreditCard(fl validator.FieldLevel) bool {
	// Implement credit card validation using Luhn algorithm
	// This is a basic implementation and should be enhanced
	num := fl.Field().String()
	if len(num) < 13 || len(num) > 19 {
		return false
	}

	sum := 0
	nDigits := len(num)
	parity := nDigits % 2
	for i := 0; i < nDigits; i++ {
		digit := int(num[i] - '0')
		if i%2 == parity {
			digit *= 2
			if digit > 9 {
				digit -= 9
			}
		}
		sum += digit
	}
	return sum%10 == 0
}

// Example validation structs
type DateRange struct {
	StartDate time.Time `json:"start_date" validate:"required"`
	EndDate   time.Time `json:"end_date" validate:"required,gtfield=StartDate"`
}

type PaginationParams struct {
	Page     int `json:"page" validate:"required,min=1"`
	PageSize int `json:"page_size" validate:"required,min=1,max=100"`
}

type SortParams struct {
	Field     string `json:"field" validate:"required"`
	Direction string `json:"direction" validate:"required,oneof=asc desc"`
}

type SearchParams struct {
	Query  string   `json:"query" validate:"omitempty,min=3"`
	Fields []string `json:"fields" validate:"required,min=1,dive,required"`
}

// Example usage of custom validation tags:
type ExampleStruct struct {
	Password   string    `json:"password" validate:"required,password"`
	Phone      string    `json:"phone" validate:"required,phone"`
	StartDate  time.Time `json:"start_date" validate:"required,future"`
	EndDate    time.Time `json:"end_date" validate:"required,gtfield=StartDate"`
	Currency   string    `json:"currency" validate:"required,currency"`
	TimeZone   string    `json:"timezone" validate:"required,timezone"`
	CreditCard string    `json:"credit_card" validate:"required,creditcard"`
	URL        string    `json:"url" validate:"required,url"`
	Pagination PaginationParams
	Sort       SortParams
	Search     SearchParams
}
