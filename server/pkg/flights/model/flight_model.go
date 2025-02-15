// pkg/flights/model/flight_model.go

package model

import (
	"fmt"
	"time"
)

const (
	FlightStatusScheduled = "SCHEDULED"
	FlightStatusDelayed   = "DELAYED"
	FlightStatusCancelled = "CANCELLED"
	FlightStatusCompleted = "COMPLETED"
)

type Flight struct {
	ID             string    `json:"id" bson:"_id"`
	FlightNumber   string    `json:"flight_number" validate:"required"`
	Airline        string    `json:"airline" validate:"required"`
	DepartureCity  string    `json:"departure_city" validate:"required"`
	ArrivalCity    string    `json:"arrival_city" validate:"required"`
	DepartureTime  time.Time `json:"departure_time" validate:"required"`
	ArrivalTime    time.Time `json:"arrival_time" validate:"required"`
	Price          float64   `json:"price" validate:"required,gt=0"`
	TotalSeats     int       `json:"total_seats" validate:"required,gt=0"`
	AvailableSeats int       `json:"available_seats"`
	Status         string    `json:"status"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

type SearchFlightRequest struct {
	DepartureCity string     `json:"departure_city" validate:"required"`
	ArrivalCity   string     `json:"arrival_city" validate:"required"`
	DepartureDate time.Time  `json:"departure_date" validate:"required"`
	ReturnDate    *time.Time `json:"return_date,omitempty"`
	Passengers    int        `json:"passengers" validate:"required,gt=0"`
	Class         string     `json:"class,omitempty" validate:"omitempty,oneof=economy business first"`
}

type FlightResponse struct {
	ID             string    `json:"id"`
	FlightNumber   string    `json:"flight_number"`
	Airline        string    `json:"airline"`
	DepartureCity  string    `json:"departure_city"`
	ArrivalCity    string    `json:"arrival_city"`
	DepartureTime  time.Time `json:"departure_time"`
	ArrivalTime    time.Time `json:"arrival_time"`
	Duration       string    `json:"duration"`
	Price          float64   `json:"price"`
	AvailableSeats int       `json:"available_seats"`
	Status         string    `json:"status"`
}

func (f *Flight) ToResponse() *FlightResponse {
	return &FlightResponse{
		ID:             f.ID,
		FlightNumber:   f.FlightNumber,
		Airline:        f.Airline,
		DepartureCity:  f.DepartureCity,
		ArrivalCity:    f.ArrivalCity,
		DepartureTime:  f.DepartureTime,
		ArrivalTime:    f.ArrivalTime,
		Duration:       f.calculateDuration(),
		Price:          f.Price,
		AvailableSeats: f.AvailableSeats,
		Status:         f.Status,
	}
}

func (f *Flight) calculateDuration() string {
	duration := f.ArrivalTime.Sub(f.DepartureTime)
	hours := int(duration.Hours())
	minutes := int(duration.Minutes()) % 60
	return fmt.Sprintf("%dh %dm", hours, minutes)
}

func (f *Flight) IsAvailable() bool {
	return f.Status == FlightStatusScheduled &&
		f.AvailableSeats > 0 &&
		f.DepartureTime.After(time.Now())
}

type UpdateFlightRequest struct {
	DepartureTime *time.Time `json:"departure_time,omitempty"`
	ArrivalTime   *time.Time `json:"arrival_time,omitempty"`
	Price         *float64   `json:"price,omitempty" validate:"omitempty,gt=0"`
	Status        *string    `json:"status,omitempty" validate:"omitempty,oneof=SCHEDULED DELAYED CANCELLED COMPLETED"`
}
