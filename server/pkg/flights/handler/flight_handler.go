package handler

import (
	"net/http"

	"github.com/Siya360/take-flight/server/pkg/common"
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

func (h *FlightHandler) GetFlight(c echo.Context) error {
	id := c.Param("id")
	flight, err := h.flightService.GetFlight(c.Request().Context(), id)
	if err != nil {
		return common.RespondWithError(c, err)
	}
	return common.RespondWithSuccess(c, flight)
}

func (h *FlightHandler) CreateFlight(c echo.Context) error {
	var flight model.Flight
	if err := common.ParseJSON(c, &flight); err != nil {
		return err
	}
	created, err := h.flightService.CreateFlight(c.Request().Context(), &flight)
	if err != nil {
		return common.RespondWithError(c, err)
	}
	return common.RespondWithSuccess(c, created)
}

func (h *FlightHandler) UpdateFlight(c echo.Context) error {
	id := c.Param("id")
	var flight model.Flight
	if err := common.ParseJSON(c, &flight); err != nil {
		return err
	}
	updated, err := h.flightService.UpdateFlight(c.Request().Context(), id, &flight)
	if err != nil {
		return common.RespondWithError(c, err)
	}
	return common.RespondWithSuccess(c, updated)
}

func (h *FlightHandler) DeleteFlight(c echo.Context) error {
	id := c.Param("id")
	if err := h.flightService.DeleteFlight(c.Request().Context(), id); err != nil {
		return common.RespondWithError(c, err)
	}
	return common.RespondWithSuccess(c, map[string]string{"message": "Flight successfully deleted"})
}
