package model

import (
	"time"
)

type Flight struct {
	ID             string    `json:"id" bson:"_id"`
	FlightNumber   string    `json:"flight_number" bson:"flight_number"`
	DepartureCity  string    `json:"departure_city" bson:"departure_city"`
	ArrivalCity    string    `json:"arrival_city" bson:"arrival_city"`
	DepartureTime  time.Time `json:"departure_time" bson:"departure_time"`
	ArrivalTime    time.Time `json:"arrival_time" bson:"arrival_time"`
	AvailableSeats int       `json:"available_seats" bson:"available_seats"`
	Price          float64   `json:"price" bson:"price"`
	Status         string    `json:"status" bson:"status"`
	CreatedAt      time.Time `json:"created_at" bson:"created_at"`
	UpdatedAt      time.Time `json:"updated_at" bson:"updated_at"`
}

type SearchFlightRequest struct {
	DepartureCity string    `json:"departure_city"`
	ArrivalCity   string    `json:"arrival_city"`
	DepartureDate time.Time `json:"departure_date"`
	Passengers    int       `json:"passengers"`
}

const (
	FlightStatusScheduled = "scheduled"
	FlightStatusCancelled = "cancelled"
	FlightStatusCompleted = "completed"
)
