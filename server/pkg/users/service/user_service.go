// pkg/users/service/user_service.go

package service

import (
	"context"
	"net/http"
	"time"

	"github.com/Siya360/take-flight/server/pkg/common"
	"github.com/Siya360/take-flight/server/pkg/users/model"
)

const (
	errMsgUserNotFound    = "User not found"
	errMsgEmailExists     = "Email already exists"
	errMsgInvalidUserData = "Invalid user data"
	errMsgFailedToSave    = "Failed to save user"
	errMsgFailedToDelete  = "Failed to delete user"
)

type UserRepository interface {
	Create(ctx context.Context, user *model.User) error
	FindByID(ctx context.Context, id string) (*model.User, error)
	FindByEmail(ctx context.Context, email string) (*model.User, error)
	Update(ctx context.Context, user *model.User) error
	Delete(ctx context.Context, id string) error
	List(ctx context.Context, limit, offset int) ([]*model.User, int, error)
}

type UserService struct {
	repo UserRepository
}

func NewUserService(repo UserRepository) *UserService {
	return &UserService{
		repo: repo,
	}
}

func (s *UserService) GetUser(ctx context.Context, id string) (*model.UserResponse, error) {
	user, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, common.NewAppError(common.ErrNotFound, errMsgUserNotFound, http.StatusNotFound)
	}
	return user.ToResponse(), nil
}

func (s *UserService) UpdateUser(ctx context.Context, id string, updates *model.UpdateUserRequest) (*model.UserResponse, error) {
	user, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return nil, common.NewAppError(common.ErrNotFound, errMsgUserNotFound, http.StatusNotFound)
	}

	if updates.Email != "" && updates.Email != user.Email {
		existing, _ := s.repo.FindByEmail(ctx, updates.Email)
		if existing != nil {
			return nil, common.NewAppError(common.ErrInvalidInput, errMsgEmailExists, http.StatusConflict)
		}
		user.Email = updates.Email
	}

	if updates.FirstName != "" {
		user.FirstName = updates.FirstName
	}
	if updates.LastName != "" {
		user.LastName = updates.LastName
	}

	user.UpdatedAt = time.Now()

	if err := s.repo.Update(ctx, user); err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, errMsgFailedToSave, http.StatusInternalServerError)
	}

	return user.ToResponse(), nil
}

func (s *UserService) DeleteUser(ctx context.Context, id string) error {
	user, err := s.repo.FindByID(ctx, id)
	if err != nil {
		return common.NewAppError(common.ErrNotFound, errMsgUserNotFound, http.StatusNotFound)
	}

	if err := s.repo.Delete(ctx, user.ID); err != nil {
		return common.NewAppError(common.ErrInternalServer, errMsgFailedToDelete, http.StatusInternalServerError)
	}

	return nil
}

func (s *UserService) ListUsers(ctx context.Context, page, pageSize int) ([]*model.UserResponse, int, error) {
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 10
	}

	offset := (page - 1) * pageSize
	users, total, err := s.repo.List(ctx, pageSize, offset)
	if err != nil {
		return nil, 0, common.NewAppError(common.ErrInternalServer, "Failed to fetch users", http.StatusInternalServerError)
	}

	responses := make([]*model.UserResponse, len(users))
	for i, user := range users {
		responses[i] = user.ToResponse()
	}

	return responses, total, nil
}
