// pkg/flights/service/flight_service.go

package service

import (
	"context"
	"net/http"
	"time"

	"github.com/Siya360/take-flight/server/pkg/common"
	"github.com/Siya360/take-flight/server/pkg/flights/model"
	"github.com/google/uuid"
)

const (
	// Cache keys
	cacheKeyPrefix = "flight:"

	// Error messages
	errMsgFlightNotFound   = "Flight not found"
	errMsgNoSeatsAvailable = "No seats available"
	errMsgInvalidFlight    = "Invalid flight data"
	errMsgFailedToSave     = "Failed to save flight"
	errMsgFailedToDelete   = "Failed to delete flight"
)

type FlightRepository interface {
	Create(ctx context.Context, flight *model.Flight) error
	FindByID(ctx context.Context, id string) (*model.Flight, error)
	Update(ctx context.Context, flight *model.Flight) error
	Delete(ctx context.Context, id string) error
	Search(ctx context.Context, criteria model.SearchFlightRequest) ([]*model.Flight, error)
	UpdateSeats(ctx context.Context, flightID string, seats int) error
}

type RedisCache interface {
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
	Get(ctx context.Context, key string) (string, error)
	Del(ctx context.Context, key string) error
}

type FlightService struct {
	repo  FlightRepository
	cache RedisCache
}

func NewFlightService(repo FlightRepository, cache RedisCache) *FlightService {
	return &FlightService{
		repo:  repo,
		cache: cache,
	}
}

func (s *FlightService) CreateFlight(ctx context.Context, flight *model.Flight) (*model.FlightResponse, error) {
	flight.ID = uuid.New().String()
	flight.Status = model.FlightStatusScheduled
	flight.AvailableSeats = flight.TotalSeats
	flight.CreatedAt = time.Now()
	flight.UpdatedAt = time.Now()

	if err := s.repo.Create(ctx, flight); err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, errMsgFailedToSave, http.StatusInternalServerError)
	}

	return flight.ToResponse(), nil
}

func (s *FlightService) GetFlight(ctx context.Context, id string) (*model.FlightResponse, error) {
	flight, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, common.NewAppError(common.ErrNotFound, errMsgFlightNotFound, http.StatusNotFound)
	}

	return flight.ToResponse(), nil
}

func (s *FlightService) UpdateFlight(ctx context.Context, id string, updates *model.UpdateFlightRequest) (*model.FlightResponse, error) {
	flight, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, common.NewAppError(common.ErrNotFound, errMsgFlightNotFound, http.StatusNotFound)
	}

	if updates.DepartureTime != nil {
		flight.DepartureTime = *updates.DepartureTime
	}
	if updates.ArrivalTime != nil {
		flight.ArrivalTime = *updates.ArrivalTime
	}
	if updates.Price != nil {
		flight.Price = *updates.Price
	}
	if updates.Status != nil {
		flight.Status = *updates.Status
	}

	flight.UpdatedAt = time.Now()

	if err := s.repo.Update(ctx, flight); err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, errMsgFailedToSave, http.StatusInternalServerError)
	}

	// Invalidate cache
	s.cache.Del(ctx, cacheKeyPrefix+id)

	return flight.ToResponse(), nil
}

func (s *FlightService) DeleteFlight(ctx context.Context, id string) error {
	flight, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return common.NewAppError(common.ErrNotFound, errMsgFlightNotFound, http.StatusNotFound)
	}

	if err := s.repo.Delete(ctx, flight.ID); err != nil {
		return common.NewAppError(common.ErrInternalServer, errMsgFailedToDelete, http.StatusInternalServerError)
	}

	// Invalidate cache
	s.cache.Del(ctx, cacheKeyPrefix+id)

	return nil
}

func (s *FlightService) SearchFlights(ctx context.Context, criteria model.SearchFlightRequest) ([]*model.FlightResponse, error) {
	flights, err := s.repo.Search(ctx, criteria)
	if err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, "Failed to search flights", http.StatusInternalServerError)
	}

	responses := make([]*model.FlightResponse, len(flights))
	for i, flight := range flights {
		responses[i] = flight.ToResponse()
	}

	return responses, nil
}

func (s *FlightService) UpdateSeats(ctx context.Context, flightID string, seatsToReserve int) error {
	flight, err := s.repo.FindByID(ctx, flightID)
	if err != nil {
		return common.NewAppError(common.ErrNotFound, errMsgFlightNotFound, http.StatusNotFound)
	}

	if flight.AvailableSeats < seatsToReserve {
		return common.NewAppError(common.ErrInvalidInput, errMsgNoSeatsAvailable, http.StatusBadRequest)
	}

	if err := s.repo.UpdateSeats(ctx, flightID, flight.AvailableSeats-seatsToReserve); err != nil {
		return common.NewAppError(common.ErrInternalServer, "Failed to update seats", http.StatusInternalServerError)
	}

	// Invalidate cache
	s.cache.Del(ctx, cacheKeyPrefix+flightID)

	return nil
}
