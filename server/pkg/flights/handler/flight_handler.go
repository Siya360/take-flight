// pkg/flights/handler/flight_handler.go

package handler

import (
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

func (h *FlightHandler) CreateFlight(c echo.Context) error {
	var flight model.Flight
	if err := common.ParseJSON(c, &flight); err != nil {
		return err
	}

	response, err := h.flightService.CreateFlight(c.Request().Context(), &flight)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, response)
}

func (h *FlightHandler) GetFlight(c echo.Context) error {
	flightID := c.Param("id")

	flight, err := h.flightService.GetFlight(c.Request().Context(), flightID)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, flight)
}

func (h *FlightHandler) UpdateFlight(c echo.Context) error {
	flightID := c.Param("id")

	var updateReq model.UpdateFlightRequest
	if err := common.ParseJSON(c, &updateReq); err != nil {
		return err
	}

	flight, err := h.flightService.UpdateFlight(c.Request().Context(), flightID, &updateReq)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, flight)
}

func (h *FlightHandler) DeleteFlight(c echo.Context) error {
	flightID := c.Param("id")

	if err := h.flightService.DeleteFlight(c.Request().Context(), flightID); err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, map[string]string{
		"message": "Flight successfully deleted",
	})
}

func (h *FlightHandler) SearchFlights(c echo.Context) error {
	var searchReq model.SearchFlightRequest
	if err := common.ParseJSON(c, &searchReq); err != nil {
		return err
	}

	flights, err := h.flightService.SearchFlights(c.Request().Context(), searchReq)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, flights)
}
