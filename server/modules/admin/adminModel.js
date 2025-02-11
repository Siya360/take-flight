// server/modules/admin/adminModel.js
export class AdminModel {
  constructor(data) {
    this.id = data.id
    this.userId = data.userId
    this.role = data.role || 'admin'
    this.permissions = data.permissions || []
    this.department = data.department
    this.managedRegions = data.managedRegions || []
    this.isActive = data.isActive !== undefined ? data.isActive : true
    this.lastLogin = data.lastLogin
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  static validateCreatePayload(data) {
    const requiredFields = ['userId', 'department']
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }

    // Validate permissions if provided
    if (data.permissions && !Array.isArray(data.permissions)) {
      throw new Error('Permissions must be an array')
    }

    // Validate managed regions if provided
    if (data.managedRegions && !Array.isArray(data.managedRegions)) {
      throw new Error('Managed regions must be an array')
    }

    return true
  }

  hasPermission(permission) {
    return this.permissions.includes(permission)
  }

  canManageRegion(region) {
    return this.managedRegions.includes(region)
  }

  toJSON() {
    return {
      ...this,
      isActive: this.isActive,
      lastLogin: this.lastLogin ? new Date(this.lastLogin) : null
    }
  }
}

export const ADMIN_PERMISSIONS = {
  MANAGE_USERS: 'manage_users',
  MANAGE_FLIGHTS: 'manage_flights',
  MANAGE_BOOKINGS: 'manage_bookings',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_ADMINS: 'manage_admins'
}

export const ADMIN_DEPARTMENTS = {
  OPERATIONS: 'operations',
  CUSTOMER_SERVICE: 'customer_service',
  FINANCE: 'finance',
  SALES: 'sales',
  TECHNICAL: 'technical'
}
