// pkg/bookings/service/booking_service.go

package service

import (
	"context"
	"net/http"
	"time"

	"github.com/Siya360/take-flight/server/pkg/bookings/model"
	"github.com/Siya360/take-flight/server/pkg/common"
	"github.com/Siya360/take-flight/server/pkg/flights/service"
	"github.com/google/uuid"
)

const (
	// Cache keys
	cacheKeyPrefix = "booking:"

	// Error messages
	errMsgBookingNotFound   = "Booking not found"
	errMsgFlightNotFound    = "Flight not found"
	errMsgInvalidBooking    = "Invalid booking data"
	errMsgFailedToSave      = "Failed to save booking"
	errMsgFailedToDelete    = "Failed to delete booking"
	errMsgInsufficientSeats = "Insufficient available seats"
)

type BookingRepository interface {
	Create(ctx context.Context, booking *model.Booking) error
	FindByID(ctx context.Context, id string) (*model.Booking, error)
	Update(ctx context.Context, booking *model.Booking) error
	Delete(ctx context.Context, id string) error
	Search(ctx context.Context, criteria model.SearchBookingRequest) ([]*model.Booking, error)
}

type RedisCache interface {
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
	Get(ctx context.Context, key string) (string, error)
	Del(ctx context.Context, key string) error
}

type BookingService struct {
	repo          BookingRepository
	flightService *service.FlightService
	cache         RedisCache
}

func NewBookingService(repo BookingRepository, flightService *service.FlightService, cache RedisCache) *BookingService {
	return &BookingService{
		repo:          repo,
		flightService: flightService,
		cache:         cache,
	}
}

func (s *BookingService) CreateBooking(ctx context.Context, userID string, req *model.CreateBookingRequest) (*model.BookingResponse, error) {
	// Get flight details and verify availability
	flight, err := s.flightService.GetFlight(ctx, req.FlightID)
	if err != nil {
		return nil, common.NewAppError(common.ErrNotFound, errMsgFlightNotFound, http.StatusNotFound)
	}

	// Calculate total price
	totalPrice := float64(req.Passengers) * flight.Price

	booking := &model.Booking{
		ID:            uuid.New().String(),
		UserID:        userID,
		FlightID:      req.FlightID,
		Status:        model.BookingStatusPending,
		Passengers:    req.Passengers,
		TotalPrice:    totalPrice,
		PaymentStatus: "pending",
		BookingDate:   time.Now(),
		CreatedAt:     time.Now(),
		UpdatedAt:     time.Now(),
	}

	// Update flight seats
	if err := s.flightService.UpdateSeats(ctx, req.FlightID, req.Passengers); err != nil {
		return nil, common.NewAppError(common.ErrInvalidInput, errMsgInsufficientSeats, http.StatusBadRequest)
	}

	if err := s.repo.Create(ctx, booking); err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, errMsgFailedToSave, http.StatusInternalServerError)
	}

	return booking.ToResponse(), nil
}

func (s *BookingService) GetBooking(ctx context.Context, id string) (*model.BookingResponse, error) {
	booking, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, common.NewAppError(common.ErrNotFound, errMsgBookingNotFound, http.StatusNotFound)
	}

	return booking.ToResponse(), nil
}

func (s *BookingService) UpdateBooking(ctx context.Context, id string, updates *model.UpdateBookingRequest) (*model.BookingResponse, error) {
	booking, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, common.NewAppError(common.ErrNotFound, errMsgBookingNotFound, http.StatusNotFound)
	}

	if updates.Status != nil {
		booking.Status = *updates.Status
	}

	if updates.Passengers != nil {
		passengerDiff := *updates.Passengers - booking.Passengers
		if passengerDiff != 0 {
			if err := s.flightService.UpdateSeats(ctx, booking.FlightID, passengerDiff); err != nil {
				return nil, common.NewAppError(common.ErrInvalidInput, errMsgInsufficientSeats, http.StatusBadRequest)
			}
			booking.Passengers = *updates.Passengers

			// Recalculate total price
			flight, err := s.flightService.GetFlight(ctx, booking.FlightID)
			if err == nil {
				booking.TotalPrice = float64(booking.Passengers) * flight.Price
			}
		}
	}

	booking.UpdatedAt = time.Now()

	if err := s.repo.Update(ctx, booking); err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, errMsgFailedToSave, http.StatusInternalServerError)
	}

	// Invalidate cache
	s.cache.Del(ctx, cacheKeyPrefix+id)

	return booking.ToResponse(), nil
}

func (s *BookingService) CancelBooking(ctx context.Context, id string) error {
	booking, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return common.NewAppError(common.ErrNotFound, errMsgBookingNotFound, http.StatusNotFound)
	}

	if booking.Status == model.BookingStatusCancelled {
		return nil
	}

	// Release the seats back to the flight
	if err := s.flightService.UpdateSeats(ctx, booking.FlightID, -booking.Passengers); err != nil {
		return common.NewAppError(common.ErrInternalServer, "Failed to update flight seats", http.StatusInternalServerError)
	}

	booking.Status = model.BookingStatusCancelled
	booking.UpdatedAt = time.Now()

	if err := s.repo.Update(ctx, booking); err != nil {
		return common.NewAppError(common.ErrInternalServer, errMsgFailedToSave, http.StatusInternalServerError)
	}

	// Invalidate cache
	s.cache.Del(ctx, cacheKeyPrefix+id)

	return nil
}

func (s *BookingService) SearchBookings(ctx context.Context, criteria model.SearchBookingRequest) ([]*model.BookingResponse, error) {
	bookings, err := s.repo.Search(ctx, criteria)
	if err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, "Failed to search bookings", http.StatusInternalServerError)
	}

	responses := make([]*model.BookingResponse, len(bookings))
	for i, booking := range bookings {
		responses[i] = booking.ToResponse()
	}

	return responses, nil
}
