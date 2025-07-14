package service

import (
	"context"
	"net/http"
	"time"

	"github.com/Siya360/take-flight/server/pkg/common"
	"github.com/Siya360/take-flight/server/pkg/flights/model"
	"github.com/google/uuid"
)

type FlightRepository interface {
	Create(ctx context.Context, flight *model.Flight) error
	FindByID(ctx context.Context, id string) (*model.Flight, error)
	Update(ctx context.Context, flight *model.Flight) error
	Delete(ctx context.Context, id string) error
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

func (s *FlightService) CreateFlight(ctx context.Context, flight *model.Flight) (*model.Flight, error) {
	if flight.ID == "" {
		flight.ID = uuid.NewString()
	}
	now := time.Now()
	if flight.CreatedAt.IsZero() {
		flight.CreatedAt = now
	}
	flight.UpdatedAt = now

	if err := s.repo.Create(ctx, flight); err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, "Failed to create flight", http.StatusInternalServerError)
	}
	return flight, nil
}

func (s *FlightService) UpdateFlight(ctx context.Context, id string, flight *model.Flight) (*model.Flight, error) {
	existing, err := s.repo.FindByID(ctx, id)
	if err != nil || existing == nil {
		return nil, common.NewAppError(common.ErrNotFound, "Flight not found", http.StatusNotFound)
	}

	flight.ID = id
	flight.CreatedAt = existing.CreatedAt
	flight.UpdatedAt = time.Now()

	if err := s.repo.Update(ctx, flight); err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, "Failed to update flight", http.StatusInternalServerError)
	}
	return flight, nil
}

func (s *FlightService) UpdateSeats(ctx context.Context, flightID string, passengerChange int) error {
	flight, err := s.repo.FindByID(ctx, flightID)
	if err != nil || flight == nil {
		return common.NewAppError(common.ErrNotFound, "Flight not found", http.StatusNotFound)
	}

	newSeats := flight.AvailableSeats - passengerChange
	if newSeats < 0 {
		return common.NewAppError(common.ErrInvalidInput, "Insufficient available seats", http.StatusBadRequest)
	}

	return s.repo.UpdateSeats(ctx, flightID, newSeats)
}

func (s *FlightService) DeleteFlight(ctx context.Context, id string) error {
	_, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return common.NewAppError(common.ErrNotFound, "Flight not found", http.StatusNotFound)
	}
	if err := s.repo.Delete(ctx, id); err != nil {
		return common.NewAppError(common.ErrInternalServer, "Failed to delete flight", http.StatusInternalServerError)
	}
	return nil
}
