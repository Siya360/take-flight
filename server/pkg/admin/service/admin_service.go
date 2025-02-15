// pkg/admin/service/admin_service.go

package service

import (
	"context"
	"net/http"
	"time"

	"github.com/Siya360/take-flight/server/pkg/admin/model"
	"github.com/Siya360/take-flight/server/pkg/common"
)

const (
	// Cache keys
	cacheKeyPrefix = "admin:"
	statsKey       = "dashboard_stats"
	configKey      = "system_config"

	// Error messages
	errMsgConfigNotFound      = "System configuration not found"
	errMsgFailedToSaveConfig  = "Failed to save system configuration"
	errMsgFailedToFetchStats  = "Failed to fetch dashboard statistics"
	errMsgInvalidDateRange    = "Invalid date range"
	errMsgFailedToLogActivity = "Failed to log admin activity"
)

type AdminRepository interface {
	SaveSystemConfig(ctx context.Context, config *model.SystemConfig) error
	GetSystemConfig(ctx context.Context) (*model.SystemConfig, error)
	LogAdminActivity(ctx context.Context, activity *model.AdminActivity) error
	GetAdminActivities(ctx context.Context, startDate, endDate time.Time) ([]*model.AdminActivity, error)
	SaveNotificationSettings(ctx context.Context, settings *model.NotificationSettings) error
	GetNotificationSettings(ctx context.Context, adminID string) (*model.NotificationSettings, error)
}

type StatsRepository interface {
	GetDashboardStats(ctx context.Context) (*model.DashboardStats, error)
	GetRevenueStats(ctx context.Context, startDate, endDate time.Time) (*model.RevenueStats, error)
	GetSystemMetrics(ctx context.Context) (*model.SystemMetrics, error)
}

type RedisCache interface {
	Set(ctx context.Context, key string, value interface{}, expiration time.Duration) error
	Get(ctx context.Context, key string) (string, error)
	Del(ctx context.Context, key string) error
}

type AdminService struct {
	adminRepo AdminRepository
	statsRepo StatsRepository
	cache     RedisCache
}

func NewAdminService(adminRepo AdminRepository, statsRepo StatsRepository, cache RedisCache) *AdminService {
	return &AdminService{
		adminRepo: adminRepo,
		statsRepo: statsRepo,
		cache:     cache,
	}
}

func (s *AdminService) GetDashboardStats(ctx context.Context) (*model.DashboardStats, error) {
	stats, err := s.statsRepo.GetDashboardStats(ctx)
	if err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, errMsgFailedToFetchStats, http.StatusInternalServerError)
	}
	return stats, nil
}

func (s *AdminService) UpdateSystemConfig(ctx context.Context, adminID string, updates *model.UpdateSystemConfigRequest) (*model.SystemConfig, error) {
	config, err := s.adminRepo.GetSystemConfig(ctx)
	if err != nil {
		return nil, common.NewAppError(common.ErrNotFound, errMsgConfigNotFound, http.StatusNotFound)
	}

	if updates.MaintenanceMode != nil {
		config.MaintenanceMode = *updates.MaintenanceMode
	}
	if updates.BookingEnabled != nil {
		config.BookingEnabled = *updates.BookingEnabled
	}
	if updates.MaxBookingsPerDay != nil {
		config.MaxBookingsPerDay = *updates.MaxBookingsPerDay
	}

	config.UpdatedAt = time.Now()
	config.UpdatedBy = adminID

	if err := s.adminRepo.SaveSystemConfig(ctx, config); err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, errMsgFailedToSaveConfig, http.StatusInternalServerError)
	}

	// Invalidate cache
	s.cache.Del(ctx, cacheKeyPrefix+configKey)

	// Log activity
	activity := &model.AdminActivity{
		AdminID:    adminID,
		Action:     "update_config",
		Resource:   "system_config",
		ResourceID: config.ID,
		CreatedAt:  time.Now(),
	}
	s.adminRepo.LogAdminActivity(ctx, activity)

	return config, nil
}

func (s *AdminService) GetRevenueStats(ctx context.Context, req model.DateRangeRequest) (*model.RevenueStats, error) {
	if req.EndDate.Before(req.StartDate) {
		return nil, common.NewAppError(common.ErrInvalidInput, errMsgInvalidDateRange, http.StatusBadRequest)
	}

	stats, err := s.statsRepo.GetRevenueStats(ctx, req.StartDate, req.EndDate)
	if err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, "Failed to fetch revenue statistics", http.StatusInternalServerError)
	}

	return stats, nil
}

func (s *AdminService) GetSystemMetrics(ctx context.Context) (*model.SystemMetrics, error) {
	metrics, err := s.statsRepo.GetSystemMetrics(ctx)
	if err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, "Failed to fetch system metrics", http.StatusInternalServerError)
	}
	return metrics, nil
}

func (s *AdminService) UpdateNotificationSettings(ctx context.Context, adminID string, updates *model.UpdateNotificationSettingsRequest) (*model.NotificationSettings, error) {
	settings, err := s.adminRepo.GetNotificationSettings(ctx, adminID)
	if err != nil {
		// If settings don't exist, create new with defaults
		settings = &model.NotificationSettings{
			AdminID:              adminID,
			EmailNotifications:   true,
			SystemAlerts:         true,
			BookingNotifications: true,
			UpdatedAt:            time.Now(),
		}
	}

	if updates.EmailNotifications != nil {
		settings.EmailNotifications = *updates.EmailNotifications
	}
	if updates.SystemAlerts != nil {
		settings.SystemAlerts = *updates.SystemAlerts
	}
	if updates.BookingNotifications != nil {
		settings.BookingNotifications = *updates.BookingNotifications
	}

	settings.UpdatedAt = time.Now()

	if err := s.adminRepo.SaveNotificationSettings(ctx, settings); err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, "Failed to save notification settings", http.StatusInternalServerError)
	}

	return settings, nil
}

func (s *AdminService) GetAdminActivities(ctx context.Context, req model.DateRangeRequest) ([]*model.AdminActivity, error) {
	if req.EndDate.Before(req.StartDate) {
		return nil, common.NewAppError(common.ErrInvalidInput, errMsgInvalidDateRange, http.StatusBadRequest)
	}

	activities, err := s.adminRepo.GetAdminActivities(ctx, req.StartDate, req.EndDate)
	if err != nil {
		return nil, common.NewAppError(common.ErrInternalServer, "Failed to fetch admin activities", http.StatusInternalServerError)
	}

	return activities, nil
}
