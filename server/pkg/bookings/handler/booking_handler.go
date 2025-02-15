// pkg/bookings/handler/booking_handler.go

package handler

import (
	"github.com/Siya360/take-flight/server/pkg/bookings/model"
	"github.com/Siya360/take-flight/server/pkg/bookings/service"
	"github.com/Siya360/take-flight/server/pkg/common"
	"github.com/labstack/echo/v4"
)

type BookingHandler struct {
	bookingService *service.BookingService
}

func NewBookingHandler(bookingService *service.BookingService) *BookingHandler {
	return &BookingHandler{
		bookingService: bookingService,
	}
}

func (h *BookingHandler) CreateBooking(c echo.Context) error {
	var req model.CreateBookingRequest
	if err := common.ParseJSON(c, &req); err != nil {
		return err
	}

	// Get user ID from context (set by auth middleware)
	userID := c.Get("user_id").(string)

	response, err := h.bookingService.CreateBooking(c.Request().Context(), userID, &req)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, response)
}

func (h *BookingHandler) GetBooking(c echo.Context) error {
	bookingID := c.Param("id")

	booking, err := h.bookingService.GetBooking(c.Request().Context(), bookingID)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, booking)
}

func (h *BookingHandler) UpdateBooking(c echo.Context) error {
	bookingID := c.Param("id")

	var updateReq model.UpdateBookingRequest
	if err := common.ParseJSON(c, &updateReq); err != nil {
		return err
	}

	booking, err := h.bookingService.UpdateBooking(c.Request().Context(), bookingID, &updateReq)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, booking)
}

func (h *BookingHandler) CancelBooking(c echo.Context) error {
	bookingID := c.Param("id")

	if err := h.bookingService.CancelBooking(c.Request().Context(), bookingID); err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, map[string]string{
		"message": "Booking successfully cancelled",
	})
}

func (h *BookingHandler) SearchBookings(c echo.Context) error {
	var searchReq model.SearchBookingRequest
	if err := common.ParseJSON(c, &searchReq); err != nil {
		return err
	}

	// If no user ID is provided in the search request, use the authenticated user's ID
	// (unless the user is an admin, which would be checked by middleware)
	if searchReq.UserID == "" {
		searchReq.UserID = c.Get("user_id").(string)
	}

	bookings, err := h.bookingService.SearchBookings(c.Request().Context(), searchReq)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, bookings)
}
