package service

import (
	"context"

	"github.com/Siya360/take-flight/server/pkg/flights/model"
)

type FlightRepository interface {
	Create(ctx context.Context, flight *model.Flight) error
	FindByID(ctx context.Context, id string) (*model.Flight, error)
	Search(ctx context.Context, criteria model.SearchFlightRequest) ([]*model.Flight, error)
	UpdateSeats(ctx context.Context, flightID string, seats int) error
}

type FlightService struct {
	repo FlightRepository
}

func NewFlightService(repo FlightRepository) *FlightService {
	return &FlightService{repo: repo}
}

func (s *FlightService) SearchFlights(ctx context.Context, criteria model.SearchFlightRequest) ([]*model.Flight, error) {
	return s.repo.Search(ctx, criteria)
}

func (s *FlightService) GetFlight(ctx context.Context, id string) (*model.Flight, error) {
	return s.repo.FindByID(ctx, id)
}
