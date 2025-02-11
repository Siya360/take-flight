// server/modules/users/usersService.js
import { UserModel } from './usersModel.js'
import bcrypt from 'bcrypt'

export class UserService {
  constructor() {
    // In a real application, you would inject a database connection here
    this.users = new Map() // Temporary in-memory storage
  }

  async create(userData) {
    try {
      // Validate user data
      UserModel.validateCreatePayload(userData)

      // Check if user already exists
      const existingUser = await this.findByEmail(userData.email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }

      // Create new user instance
      const user = new UserModel({
        id: Date.now().toString(), // Temporary ID generation
        ...userData
      })

      // Hash password
      await user.hashPassword()

      // Save user
      this.users.set(user.id, user)

      return user.toJSON()
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`)
    }
  }

  async findById(id) {
    const user = this.users.get(id)
    return user ? user.toJSON() : null
  }

  async findByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user
      }
    }
    return null
  }

  async update(id, updateData) {
    const user = this.users.get(id)
    if (!user) {
      throw new Error('User not found')
    }

    // Don't allow email or role updates through this method
    delete updateData.email
    delete updateData.role
    delete updateData.password

    Object.assign(user, {
      ...updateData,
      updatedAt: new Date()
    })

    this.users.set(id, user)
    return user.toJSON()
  }

  async updatePassword(id, oldPassword, newPassword) {
    const user = this.users.get(id)
    if (!user) {
      throw new Error('User not found')
    }

    // Verify old password
    const isValid = await bcrypt.compare(oldPassword, user.password)
    if (!isValid) {
      throw new Error('Invalid current password')
    }

    // Update password
    user.password = newPassword
    await user.hashPassword()
    user.updatedAt = new Date()

    this.users.set(id, user)
    return true
  }

  async delete(id) {
    const exists = this.users.has(id)
    if (!exists) {
      throw new Error('User not found')
    }

    this.users.delete(id)
    return true
  }
}
