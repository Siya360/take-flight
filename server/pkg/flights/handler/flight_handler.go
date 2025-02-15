package handler

import (
	"net/http"

	"github.com/Siya360/take-flight/server/pkg/flights/model"
	"github.com/Siya360/take-flight/server/pkg/flights/service"
	"github.com/labstack/echo/v4"
)

type FlightHandler struct {
	flightService *service.FlightService
}

func NewFlightHandler(flightService *service.FlightService) *FlightHandler {
	return &FlightHandler{
		flightService: flightService,
	}
}

func (h *FlightHandler) SearchFlights(c echo.Context) error {
	var criteria model.SearchFlightRequest
	if err := c.Bind(&criteria); err != nil {
		return c.JSON(http.StatusBadRequest, map[string]string{"error": "Invalid request"})
	}

	flights, err := h.flightService.SearchFlights(c.Request().Context(), criteria)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, map[string]string{"error": err.Error()})
	}

	return c.JSON(http.StatusOK, flights)
}
