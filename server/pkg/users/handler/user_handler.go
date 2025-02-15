// pkg/users/handler/user_handler.go

package handler

import (
	"strconv"

	"github.com/Siya360/take-flight/server/pkg/common"
	"github.com/Siya360/take-flight/server/pkg/users/model"
	"github.com/Siya360/take-flight/server/pkg/users/service"
	"github.com/labstack/echo/v4"
)

type UserHandler struct {
	userService *service.UserService
}

func NewUserHandler(userService *service.UserService) *UserHandler {
	return &UserHandler{
		userService: userService,
	}
}

func (h *UserHandler) GetUser(c echo.Context) error {
	userID := c.Param("id")

	user, err := h.userService.GetUser(c.Request().Context(), userID)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, user)
}

func (h *UserHandler) UpdateUser(c echo.Context) error {
	userID := c.Param("id")

	var updateReq model.UpdateUserRequest
	if err := common.ParseJSON(c, &updateReq); err != nil {
		return err
	}

	user, err := h.userService.UpdateUser(c.Request().Context(), userID, &updateReq)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, user)
}

func (h *UserHandler) DeleteUser(c echo.Context) error {
	userID := c.Param("id")

	if err := h.userService.DeleteUser(c.Request().Context(), userID); err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, map[string]string{
		"message": "User successfully deleted",
	})
}

func (h *UserHandler) ListUsers(c echo.Context) error {
	page, _ := strconv.Atoi(c.QueryParam("page"))
	pageSize, _ := strconv.Atoi(c.QueryParam("page_size"))

	users, total, err := h.userService.ListUsers(c.Request().Context(), page, pageSize)
	if err != nil {
		return common.RespondWithError(c, err)
	}

	return common.RespondWithSuccess(c, map[string]interface{}{
		"users": users,
		"total": total,
		"page":  page,
		"size":  pageSize,
	})
}
