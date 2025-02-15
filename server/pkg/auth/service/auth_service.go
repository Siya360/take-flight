// pkg/auth/service/auth_service.go
package service

import (
	"context"
	"net/http"
	"time"

	"github.com/Siya360/take-flight/server/pkg/auth/model"
	"github.com/Siya360/take-flight/server/pkg/common"
	"github.com/golang-jwt/jwt/v4"
	"github.com/google/uuid"
)

const (
	// Token prefixes
	tokenPrefix          = "token:"
	tokenBlacklistPrefix = "blacklist:"

	// Error messages
	errMsgUserNotFound       = "User not found"
	errMsgFailedToCreateUser = "Failed to create user"
	errMsgFailedToUpdatePass = "Failed to update password"
	errMsgInvalidTokenSign   = "Invalid token signing method"
	errMsgTokenRevoked       = "Token has been revoked"
	errMsgInvalidTokenClaims = "Invalid token claims"
)

type UserRepository interface {
	FindByEmail(ctx context.Context, email string) (*model.User, error)
	FindByID(ctx context.Context, id string) (*model.User, error)
	Create(ctx context.Context, user *model.User) error
	Update(ctx context.Context, user *model.User) error
	Delete(ctx context.Context, id string) error
}

type RedisCache interface {
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
	Get(ctx context.Context, key string) (string, error)
	Del(ctx context.Context, key string) error
}

type AuthService struct {
	config     *common.Config
	userRepo   UserRepository
	redisCache RedisCache
}

func NewAuthService(config *common.Config, userRepo UserRepository, cache RedisCache) *AuthService {
	return &AuthService{
		config:     config,
		userRepo:   userRepo,
		redisCache: cache,
	}
}

func (s *AuthService) Login(ctx context.Context, creds *model.Credentials) (*model.Token, error) {
	user, err := s.userRepo.FindByEmail(ctx, creds.Email)
	if err != nil {
		return nil, common.ErrInvalidCredentials
	}

	if err := model.ComparePasswords(user.Password, creds.Password); err != nil {
		return nil, common.ErrInvalidCredentials
	}

	token, err := s.generateTokens(user)
	if err != nil {
		return nil, err
	}

	err = s.redisCache.Set(
		ctx,
		tokenPrefix+user.ID,
		token.AccessToken,
		time.Hour*time.Duration(s.config.JWT.ExpireHours),
	)
	if err != nil {
		return nil, err
	}

	return token, nil
}

func (s *AuthService) Register(ctx context.Context, data *model.RegisterRequest) (*model.Token, error) {
	existingUser, err := s.userRepo.FindByEmail(ctx, data.Email)
	if err == nil && existingUser != nil {
		return nil, common.NewAppError(common.ErrInvalidInput, "Email already registered", http.StatusConflict)
	}

	hashedPassword, err := model.HashPassword(data.Password)
	if err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, "Failed to process password", http.StatusInternalServerError)
	}

	user := &model.User{
		ID:        uuid.New().String(),
		Email:     data.Email,
		Password:  hashedPassword,
		FirstName: data.FirstName,
		LastName:  data.LastName,
		Role:      "user",
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	if err := s.userRepo.Create(ctx, user); err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, "Failed to create user", http.StatusInternalServerError)
	}

	return s.generateTokens(user)
}

func (s *AuthService) Logout(ctx context.Context, userID string) error {
	if err := s.redisCache.Del(ctx, tokenPrefix+userID); err != nil {
		return common.NewAppError(common.ErrInternalServer, "Failed to logout", http.StatusInternalServerError)
	}

	if err := s.redisCache.Set(
		ctx,
		tokenBlacklistPrefix+userID,
		time.Now().String(),
		time.Hour*24,
	); err != nil {
		return common.NewAppError(common.ErrInternalServer, "Failed to blacklist token", http.StatusInternalServerError)
	}

	return nil
}

func (s *AuthService) GetUserByID(ctx context.Context, userID string) (*model.User, error) {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return nil, common.NewAppError(common.ErrNotFound, errMsgUserNotFound, http.StatusNotFound)
	}
	return user, nil
}

func (s *AuthService) UpdatePassword(ctx context.Context, userID string, currentPassword, newPassword string) error {
	user, err := s.userRepo.FindByID(ctx, userID)
	if err != nil {
		return common.NewAppError(common.ErrNotFound, errMsgUserNotFound, http.StatusNotFound)
	}

	if err := model.ComparePasswords(user.Password, currentPassword); err != nil {
		return common.NewAppError(common.ErrInvalidCredentials, "Invalid current password", http.StatusUnauthorized)
	}

	hashedPassword, err := model.HashPassword(newPassword)
	if err != nil {
		return common.NewAppError(common.ErrInternalServer, "Failed to process new password", http.StatusInternalServerError)
	}

	user.Password = hashedPassword
	user.UpdatedAt = time.Now()

	if err := s.userRepo.Update(ctx, user); err != nil {
		return common.NewAppError(common.ErrInternalServer, "Failed to update password", http.StatusInternalServerError)
	}

	return nil
}

func (s *AuthService) RefreshToken(ctx context.Context, refreshToken string) (*model.Token, error) {
	token, err := jwt.ParseWithClaims(refreshToken, &model.TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, common.NewAppError(common.ErrInvalidToken, errMsgUserNotFound, http.StatusUnauthorized)
		}
		return []byte(s.config.JWT.RefreshSecret), nil
	})

	if err != nil {
		return nil, common.NewAppError(common.ErrInvalidToken, "Invalid refresh token", http.StatusUnauthorized)
	}

	claims, ok := token.Claims.(*model.TokenClaims)
	if !ok || !token.Valid {
		return nil, common.NewAppError(common.ErrInvalidToken, errMsgInvalidTokenClaims, http.StatusUnauthorized)
	}

	_, err = s.redisCache.Get(ctx, tokenBlacklistPrefix+claims.UserID)
	if err == nil {
		return nil, common.NewAppError(common.ErrInvalidToken, "Token has been revoked", http.StatusUnauthorized)
	}

	user, err := s.userRepo.FindByID(ctx, claims.UserID)
	if err != nil {
		return nil, common.NewAppError(common.ErrInvalidToken, "User not found", http.StatusUnauthorized)
	}

	return s.generateTokens(user)
}

func (s *AuthService) ValidateToken(ctx context.Context, tokenString string) (*model.TokenClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &model.TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, common.NewAppError(common.ErrInvalidToken, "Invalid token signing method", http.StatusUnauthorized)
		}
		return []byte(s.config.JWT.Secret), nil
	})

	if err != nil {
		return nil, common.NewAppError(common.ErrInvalidToken, "Invalid token", http.StatusUnauthorized)
	}

	claims, ok := token.Claims.(*model.TokenClaims)
	if !ok || !token.Valid {
		return nil, common.NewAppError(common.ErrInvalidToken, "Invalid token claims", http.StatusUnauthorized)
	}

	_, err = s.redisCache.Get(ctx, tokenBlacklistPrefix+claims.UserID)
	if err == nil {
		return nil, common.NewAppError(common.ErrInvalidToken, errMsgTokenRevoked, http.StatusUnauthorized)
	}

	return claims, nil
}

func (s *AuthService) generateTokens(user *model.User) (*model.Token, error) {
	now := time.Now()

	claims := model.TokenClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			IssuedAt:  jwt.NewNumericDate(now),
			ExpiresAt: jwt.NewNumericDate(now.Add(time.Hour * time.Duration(s.config.JWT.ExpireHours))),
		},
		UserID: user.ID,
		Role:   user.Role,
		Email:  user.Email,
	}

	accessToken, expiresAt, err := s.generateJWT(claims, s.config.JWT.Secret, time.Hour*time.Duration(s.config.JWT.ExpireHours))
	if err != nil {
		return nil, err
	}

	refreshClaims := claims
	refreshClaims.ExpiresAt = jwt.NewNumericDate(now.Add(time.Hour * 24 * 7))
	refreshToken, _, err := s.generateJWT(refreshClaims, s.config.JWT.RefreshSecret, time.Hour*24*7)
	if err != nil {
		return nil, err
	}

	return &model.Token{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresAt:    expiresAt,
		TokenType:    "Bearer",
	}, nil
}

func (s *AuthService) generateJWT(claims model.TokenClaims, secret string, expiration time.Duration) (string, time.Time, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(secret))
	if err != nil {
		return "", time.Time{}, err
	}

	return tokenString, time.Now().Add(expiration), nil
}
