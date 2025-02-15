// pkg/admin/model/admin_model.go

package model

import "time"

// DashboardStats represents system-wide statistics
type DashboardStats struct {
	TotalUsers    int64     `json:"total_users"`
	TotalFlights  int64     `json:"total_flights"`
	TotalBookings int64     `json:"total_bookings"`
	Revenue       float64   `json:"revenue"`
	ActiveFlights int64     `json:"active_flights"`
	PendingOrders int64     `json:"pending_orders"`
	UpdatedAt     time.Time `json:"updated_at"`
}

// SystemConfig represents system-wide configuration settings
type SystemConfig struct {
	ID                string    `json:"id" bson:"_id,omitempty"`
	MaintenanceMode   bool      `json:"maintenance_mode" bson:"maintenance_mode"`
	BookingEnabled    bool      `json:"booking_enabled" bson:"booking_enabled"`
	MaxBookingsPerDay int       `json:"max_bookings_per_day" bson:"max_bookings_per_day"`
	CreatedAt         time.Time `json:"created_at" bson:"created_at"`
	UpdatedAt         time.Time `json:"updated_at" bson:"updated_at"`
	UpdatedBy         string    `json:"updated_by" bson:"updated_by"`
}

// AdminActivity represents admin action logs
type AdminActivity struct {
	ID         string    `json:"id" bson:"_id,omitempty"`
	AdminID    string    `json:"admin_id" bson:"admin_id"`
	Action     string    `json:"action" bson:"action"`
	Resource   string    `json:"resource" bson:"resource"`
	ResourceID string    `json:"resource_id" bson:"resource_id"`
	Details    string    `json:"details" bson:"details"`
	IP         string    `json:"ip" bson:"ip"`
	CreatedAt  time.Time `json:"created_at" bson:"created_at"`
}

// UpdateSystemConfigRequest represents the request to update system configuration
type UpdateSystemConfigRequest struct {
	MaintenanceMode   *bool `json:"maintenance_mode,omitempty"`
	BookingEnabled    *bool `json:"booking_enabled,omitempty"`
	MaxBookingsPerDay *int  `json:"max_bookings_per_day,omitempty" validate:"omitempty,min=1"`
}

// DateRangeRequest represents a date range filter for admin queries
type DateRangeRequest struct {
	StartDate time.Time `json:"start_date" validate:"required"`
	EndDate   time.Time `json:"end_date" validate:"required,gtfield=StartDate"`
}

// RevenueStats represents revenue statistics
type RevenueStats struct {
	Daily   []DailyRevenue   `json:"daily"`
	Monthly []MonthlyRevenue `json:"monthly"`
	Total   float64          `json:"total"`
}

// DailyRevenue represents daily revenue data
type DailyRevenue struct {
	Date     time.Time `json:"date"`
	Revenue  float64   `json:"revenue"`
	Bookings int64     `json:"bookings"`
}

// MonthlyRevenue represents monthly revenue data
type MonthlyRevenue struct {
	Month    time.Time `json:"month"`
	Revenue  float64   `json:"revenue"`
	Bookings int64     `json:"bookings"`
}

// AdminResponse represents the admin user data returned to clients
type AdminResponse struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// SystemMetrics represents system performance metrics
type SystemMetrics struct {
	ActiveUsers       int64     `json:"active_users"`
	ServerLoad        float64   `json:"server_load"`
	MemoryUsage       float64   `json:"memory_usage"`
	AverageResponseMs float64   `json:"average_response_ms"`
	ErrorRate         float64   `json:"error_rate"`
	Timestamp         time.Time `json:"timestamp"`
}

// NotificationSettings represents admin notification preferences
type NotificationSettings struct {
	ID                   string    `json:"id" bson:"_id,omitempty"`
	AdminID              string    `json:"admin_id" bson:"admin_id"`
	EmailNotifications   bool      `json:"email_notifications" bson:"email_notifications"`
	SystemAlerts         bool      `json:"system_alerts" bson:"system_alerts"`
	BookingNotifications bool      `json:"booking_notifications" bson:"booking_notifications"`
	UpdatedAt            time.Time `json:"updated_at" bson:"updated_at"`
}

// UpdateNotificationSettingsRequest represents the request to update notification settings
type UpdateNotificationSettingsRequest struct {
	EmailNotifications   *bool `json:"email_notifications,omitempty"`
	SystemAlerts         *bool `json:"system_alerts,omitempty"`
	BookingNotifications *bool `json:"booking_notifications,omitempty"`
}
