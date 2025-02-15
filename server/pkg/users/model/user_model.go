// pkg/users/model/user_model.go

package model

import (
	"time"
)

type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email" validate:"required,email"`
	Password  string    `json:"-"` // "-" ensures password is never serialized
	FirstName string    `json:"first_name" validate:"required"`
	LastName  string    `json:"last_name" validate:"required"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type UpdateUserRequest struct {
	FirstName string `json:"first_name,omitempty" validate:"omitempty"`
	LastName  string `json:"last_name,omitempty" validate:"omitempty"`
	Email     string `json:"email,omitempty" validate:"omitempty,email"`
}

type UserResponse struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (u *User) ToResponse() *UserResponse {
	return &UserResponse{
		ID:        u.ID,
		Email:     u.Email,
		FirstName: u.FirstName,
		LastName:  u.LastName,
		Role:      u.Role,
		CreatedAt: u.CreatedAt,
		UpdatedAt: u.UpdatedAt,
	}
}
