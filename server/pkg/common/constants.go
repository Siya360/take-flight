// pkg/common/constants.go

package common

const (
	// Context keys
	ContextUserKey = "user"

	// User roles
	RoleAdmin = "admin"
	RoleUser  = "user"

	// Booking statuses
	BookingStatusPending   = "pending"
	BookingStatusConfirmed = "confirmed"
	BookingStatusCancelled = "cancelled"

	// Flight statuses
	FlightStatusScheduled = "scheduled"
	FlightStatusDelayed   = "delayed"
	FlightStatusCancelled = "cancelled"
	FlightStatusCompleted = "completed"

	// Cache keys
	CacheKeyFlight  = "flight:%s"
	CacheKeyBooking = "booking:%s"
	CacheKeyUser    = "user:%s"
)
