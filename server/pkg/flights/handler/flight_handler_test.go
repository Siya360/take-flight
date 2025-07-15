package handler

import (
	"bytes"
	"context"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/labstack/echo/v4"

	"github.com/Siya360/take-flight/server/pkg/flights/model"
	"github.com/Siya360/take-flight/server/pkg/flights/service"
)

type mockFlightRepo struct {
	searchCalled bool
	searchArg    model.SearchFlightRequest
}

func (m *mockFlightRepo) Create(ctx context.Context, flight *model.Flight) error { return nil }
func (m *mockFlightRepo) FindByID(ctx context.Context, id string) (*model.Flight, error) {
	return nil, nil
}
func (m *mockFlightRepo) Update(ctx context.Context, flight *model.Flight) error { return nil }
func (m *mockFlightRepo) Delete(ctx context.Context, id string) error            { return nil }
func (m *mockFlightRepo) Search(ctx context.Context, criteria model.SearchFlightRequest) ([]*model.Flight, error) {
	m.searchCalled = true
	m.searchArg = criteria
	return []*model.Flight{{ID: "1", DepartureCity: criteria.DepartureCity}}, nil
}
func (m *mockFlightRepo) UpdateSeats(ctx context.Context, id string, seats int) error { return nil }

func TestSearchFlights(t *testing.T) {
	repo := &mockFlightRepo{}
	svc := service.NewFlightService(repo)
	h := NewFlightHandler(svc)

	e := echo.New()
	reqData := model.SearchFlightRequest{
		DepartureCity: "A",
		ArrivalCity:   "B",
		DepartureDate: time.Now(),
		Passengers:    1,
	}
	body, _ := json.Marshal(reqData)
	req := httptest.NewRequest(http.MethodPost, "/", bytes.NewReader(body))
	req.Header.Set(echo.HeaderContentType, echo.MIMEApplicationJSON)
	rec := httptest.NewRecorder()
	c := e.NewContext(req, rec)

	if err := h.SearchFlights(c); err != nil {
		t.Fatalf("handler error: %v", err)
	}
	if rec.Code != http.StatusOK {
		t.Fatalf("expected status 200 got %d", rec.Code)
	}
	if !repo.searchCalled {
		t.Fatal("expected search to be called")
	}
	if repo.searchArg.DepartureCity != "A" {
		t.Fatalf("unexpected criteria: %+v", repo.searchArg)
	}
}
