package service

import (
	"context"
	"testing"

	"github.com/Siya360/take-flight/server/pkg/flights/model"
)

type mockFlightRepo struct {
	createFunc      func(ctx context.Context, flight *model.Flight) error
	findByIDFunc    func(ctx context.Context, id string) (*model.Flight, error)
	updateFunc      func(ctx context.Context, flight *model.Flight) error
	deleteFunc      func(ctx context.Context, id string) error
	searchFunc      func(ctx context.Context, criteria model.SearchFlightRequest) ([]*model.Flight, error)
	updateSeatsFunc func(ctx context.Context, id string, seats int) error
}

func (m *mockFlightRepo) Create(ctx context.Context, flight *model.Flight) error {
	if m.createFunc != nil {
		return m.createFunc(ctx, flight)
	}
	return nil
}

func (m *mockFlightRepo) FindByID(ctx context.Context, id string) (*model.Flight, error) {
	if m.findByIDFunc != nil {
		return m.findByIDFunc(ctx, id)
	}
	return nil, nil
}

func (m *mockFlightRepo) Update(ctx context.Context, flight *model.Flight) error {
	if m.updateFunc != nil {
		return m.updateFunc(ctx, flight)
	}
	return nil
}

func (m *mockFlightRepo) Delete(ctx context.Context, id string) error {
	if m.deleteFunc != nil {
		return m.deleteFunc(ctx, id)
	}
	return nil
}

func (m *mockFlightRepo) Search(ctx context.Context, criteria model.SearchFlightRequest) ([]*model.Flight, error) {
	if m.searchFunc != nil {
		return m.searchFunc(ctx, criteria)
	}
	return nil, nil
}

func (m *mockFlightRepo) UpdateSeats(ctx context.Context, id string, seats int) error {
	if m.updateSeatsFunc != nil {
		return m.updateSeatsFunc(ctx, id, seats)
	}
	return nil
}

func TestCreateFlightSetsID(t *testing.T) {
	repo := &mockFlightRepo{}
	svc := NewFlightService(repo)
	flight := &model.Flight{}
	if _, err := svc.CreateFlight(context.Background(), flight); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if flight.ID == "" {
		t.Fatal("expected ID to be set")
	}
	if flight.CreatedAt.IsZero() || flight.UpdatedAt.IsZero() {
		t.Fatal("expected timestamps to be set")
	}
}

func TestUpdateSeatsInsufficient(t *testing.T) {
	repo := &mockFlightRepo{
		findByIDFunc: func(ctx context.Context, id string) (*model.Flight, error) {
			return &model.Flight{ID: id, AvailableSeats: 1}, nil
		},
	}
	svc := NewFlightService(repo)
	if err := svc.UpdateSeats(context.Background(), "1", 2); err == nil {
		t.Fatal("expected error")
	}
}
