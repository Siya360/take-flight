// pkg/admin/handler/admin_handler.go

package handler

import (
	"github.com/Siya360/take-flight/server/pkg/admin/model"
	"github.com/Siya360/take-flight/server/pkg/admin/service"
	"github.com/Siya360/take-flight/server/pkg/common"
	"github.com/labstack/echo/v4"
)

type AdminHandler struct {
	adminService *service.AdminService
}

func NewAdminHandler(adminService *service.AdminService) *AdminHandler {
	return &AdminHandler{
		adminService: adminService,
	}
}

func (h *AdminHandler) GetDashboardStats(c echo.Context) error {
	stats, err := h.adminService.GetDashboardStats(c.Request().Context())
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, stats)
}

func (h *AdminHandler) UpdateSystemConfig(c echo.Context) error {
	var req model.UpdateSystemConfigRequest
	if err := common.ParseJSON(c, &req); err != nil {
		return err
	}

	// Get admin ID from context (set by admin middleware)
	adminID := c.Get("user_id").(string)

	config, err := h.adminService.UpdateSystemConfig(c.Request().Context(), adminID, &req)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, config)
}

func (h *AdminHandler) GetRevenueStats(c echo.Context) error {
	var req model.DateRangeRequest
	if err := common.ParseJSON(c, &req); err != nil {
		return err
	}

	stats, err := h.adminService.GetRevenueStats(c.Request().Context(), req)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, stats)
}

func (h *AdminHandler) GetSystemMetrics(c echo.Context) error {
	metrics, err := h.adminService.GetSystemMetrics(c.Request().Context())
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, metrics)
}

func (h *AdminHandler) UpdateNotificationSettings(c echo.Context) error {
	var req model.UpdateNotificationSettingsRequest
	if err := common.ParseJSON(c, &req); err != nil {
		return err
	}

	adminID := c.Get("user_id").(string)

	settings, err := h.adminService.UpdateNotificationSettings(c.Request().Context(), adminID, &req)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, settings)
}

func (h *AdminHandler) GetAdminActivities(c echo.Context) error {
	var req model.DateRangeRequest
	if err := common.ParseJSON(c, &req); err != nil {
		return err
	}

	activities, err := h.adminService.GetAdminActivities(c.Request().Context(), req)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, activities)
}
