// server/modules/admin/adminService.js
import { AdminModel, ADMIN_PERMISSIONS } from './adminModel.js'
import { UserService } from '../users/usersService.js'

export class AdminService {
  constructor() {
    this.userService = new UserService()
    this.admins = new Map() // Temporary in-memory storage
  }

  async create(adminData) {
    try {
      // Validate admin data
      AdminModel.validateCreatePayload(adminData)

      // Verify user exists
      const user = await this.userService.findById(adminData.userId)
      if (!user) {
        throw new Error('User not found')
      }

      // Check if admin already exists for this user
      const existingAdmin = await this.findByUserId(adminData.userId)
      if (existingAdmin) {
        throw new Error('Admin already exists for this user')
      }

      // Create new admin instance
      const admin = new AdminModel({
        id: Date.now().toString(), // Temporary ID generation
        ...adminData
      })

      // Save admin
      this.admins.set(admin.id, admin)

      return admin.toJSON()
    } catch (error) {
      throw new Error(`Error creating admin: ${error.message}`)
    }
  }

  async findById(id) {
    const admin = this.admins.get(id)
    return admin ? admin.toJSON() : null
  }

  async findByUserId(userId) {
    for (const admin of this.admins.values()) {
      if (admin.userId === userId) {
        return admin.toJSON()
      }
    }
    return null
  }

  async findByDepartment(department) {
    return Array.from(this.admins.values())
      .filter(admin => admin.department === department)
      .map(admin => admin.toJSON())
  }

  async update(id, updateData) {
    const admin = this.admins.get(id)
    if (!admin) {
      throw new Error('Admin not found')
    }

    // Don't allow updating certain fields
    delete updateData.id
    delete updateData.userId
    delete updateData.createdAt

    Object.assign(admin, {
      ...updateData,
      updatedAt: new Date()
    })

    this.admins.set(id, admin)
    return admin.toJSON()
  }

  async updatePermissions(id, permissions) {
    const admin = this.admins.get(id)
    if (!admin) {
      throw new Error('Admin not found')
    }

    // Validate permissions
    const invalidPermissions = permissions.filter(
      permission => !Object.values(ADMIN_PERMISSIONS).includes(permission)
    )

    if (invalidPermissions.length > 0) {
      throw new Error(`Invalid permissions: ${invalidPermissions.join(', ')}`)
    }

    admin.permissions = permissions
    admin.updatedAt = new Date()

    this.admins.set(id, admin)
    return admin.toJSON()
  }

  async deactivate(id) {
    const admin = this.admins.get(id)
    if (!admin) {
      throw new Error('Admin not found')
    }

    admin.isActive = false
    admin.updatedAt = new Date()

    this.admins.set(id, admin)
    return admin.toJSON()
  }

  async reactivate(id) {
    const admin = this.admins.get(id)
    if (!admin) {
      throw new Error('Admin not found')
    }

    admin.isActive = true
    admin.updatedAt = new Date()

    this.admins.set(id, admin)
    return admin.toJSON()
  }

  async updateLastLogin(id) {
    const admin = this.admins.get(id)
    if (!admin) {
      throw new Error('Admin not found')
    }

    admin.lastLogin = new Date()
    admin.updatedAt = new Date()

    this.admins.set(id, admin)
    return admin.toJSON()
  }
}
