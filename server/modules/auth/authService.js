// server/modules/auth/authService.js
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { redisClient } from './session/redisStore.js'
import { UserService } from '../users/usersService.js'

export class AuthService {
  constructor() {
    this.userService = new UserService()
  }

  async validatePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword)
  }

  async hashPassword(password) {
    const saltRounds = 10
    return bcrypt.hash(password, saltRounds)
  }

  generateTokens(userId, role) {
    const accessToken = jwt.sign(
      { userId, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    )

    const refreshToken = jwt.sign(
      { userId, type: 'refresh' },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    )

    return { accessToken, refreshToken }
  }

  async createSession(user, sessionId) {
    const sessionData = {
      userId: user.id,
      role: user.role,
      createdAt: Date.now()
    }

    await redisClient.set(
      `session:${sessionId}`,
      JSON.stringify(sessionData),
      'EX',
      24 * 60 * 60 // 24 hours
    )

    return sessionData
  }

  async destroySession(sessionId) {
    await redisClient.del(`session:${sessionId}`)
  }

  async refreshTokens(refreshToken) {
    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET)
      
      const user = await this.userService.findById(decoded.userId)
      if (!user) {
        throw new Error('User not found')
      }

      return this.generateTokens(user.id, user.role)
    } catch (error) {
      throw new Error('Invalid refresh token')
    }
  }

  async validateApiKey(apiKey) {
    // Implement API key validation logic
    // This could check against a database of valid API keys
    return true // Placeholder implementation
  }
}
