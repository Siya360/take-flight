// pkg/bookings/model/booking_model.go

package model

import (
	"time"
)

type BookingStatus string

const (
	BookingStatusPending   BookingStatus = "pending"
	BookingStatusConfirmed BookingStatus = "confirmed"
	BookingStatusCancelled BookingStatus = "cancelled"
	BookingStatusCompleted BookingStatus = "completed"
)

type Booking struct {
	ID            string        `json:"id" bson:"_id,omitempty"`
	UserID        string        `json:"user_id" bson:"user_id" validate:"required"`
	FlightID      string        `json:"flight_id" bson:"flight_id" validate:"required"`
	Status        BookingStatus `json:"status" bson:"status"`
	Passengers    int           `json:"passengers" bson:"passengers" validate:"required,min=1"`
	TotalPrice    float64       `json:"total_price" bson:"total_price"`
	PaymentStatus string        `json:"payment_status" bson:"payment_status"`
	BookingDate   time.Time     `json:"booking_date" bson:"booking_date"`
	CreatedAt     time.Time     `json:"created_at" bson:"created_at"`
	UpdatedAt     time.Time     `json:"updated_at" bson:"updated_at"`
}

type CreateBookingRequest struct {
	FlightID   string `json:"flight_id" validate:"required"`
	Passengers int    `json:"passengers" validate:"required,min=1"`
}

type UpdateBookingRequest struct {
	Status     *BookingStatus `json:"status,omitempty"`
	Passengers *int           `json:"passengers,omitempty" validate:"omitempty,min=1"`
}

type BookingResponse struct {
	ID            string        `json:"id"`
	UserID        string        `json:"user_id"`
	FlightID      string        `json:"flight_id"`
	Status        BookingStatus `json:"status"`
	Passengers    int           `json:"passengers"`
	TotalPrice    float64       `json:"total_price"`
	PaymentStatus string        `json:"payment_status"`
	BookingDate   time.Time     `json:"booking_date"`
	CreatedAt     time.Time     `json:"created_at"`
	UpdatedAt     time.Time     `json:"updated_at"`
}

type SearchBookingRequest struct {
	UserID    string        `json:"user_id,omitempty"`
	FlightID  string        `json:"flight_id,omitempty"`
	Status    BookingStatus `json:"status,omitempty"`
	StartDate *time.Time    `json:"start_date,omitempty"`
	EndDate   *time.Time    `json:"end_date,omitempty"`
}

func (b *Booking) ToResponse() *BookingResponse {
	return &BookingResponse{
		ID:            b.ID,
		UserID:        b.UserID,
		FlightID:      b.FlightID,
		Status:        b.Status,
		Passengers:    b.Passengers,
		TotalPrice:    b.TotalPrice,
		PaymentStatus: b.PaymentStatus,
		BookingDate:   b.BookingDate,
		CreatedAt:     b.CreatedAt,
		UpdatedAt:     b.UpdatedAt,
	}
}
