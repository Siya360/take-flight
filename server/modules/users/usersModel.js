// server/modules/users/usersModel.js
import bcrypt from 'bcrypt'

export class UserModel {
  constructor(data) {
    this.id = data.id
    this.email = data.email
    this.firstName = data.firstName
    this.lastName = data.lastName
    this.role = data.role || 'user'
    this.password = data.password
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  // Static methods for data validation
  static validateCreatePayload(data) {
    const requiredFields = ['email', 'password', 'firstName', 'lastName']
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format')
    }

    // Password validation (min 8 chars, at least one number and one letter)
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!passwordRegex.test(data.password)) {
      throw new Error('Password must be at least 8 characters long and contain at least one letter and one number')
    }

    return true
  }

  // Instance methods
  async hashPassword() {
    const saltRounds = 10
    this.password = await bcrypt.hash(this.password, saltRounds)
  }

  toJSON() {
    const user = { ...this }
    delete user.password // Remove sensitive data
    return user
  }
}
