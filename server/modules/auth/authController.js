// server/modules/auth/authController.js
import { Router } from 'express'
import { AuthService } from './authService'
import passport from 'passport'

export class AuthController {
  constructor() {
    this.router = Router()
    this.authService = new AuthService()
    this.initializeRoutes()
  }

  initializeRoutes() {
    // Local authentication routes
    this.router.post('/login', this.login.bind(this))
    this.router.post('/logout', this.logout.bind(this))
    this.router.post('/register', this.register.bind(this))
    
    // External API authentication routes
    this.router.post('/token', this.generateApiToken.bind(this))
    this.router.post('/refresh-token', this.refreshToken.bind(this))
  }

  async login(req, res, next) {
    // Using passport for local authentication
    passport.authenticate('local', async (err, user, info) => {
      try {
        if (err) throw err
        if (!user) {
          return res.status(401).json({ 
            message: info?.message || 'Invalid credentials' 
          })
        }

        // Create session and generate tokens
        const authData = await this.authService.createSession(user)
        
        return res.json({
          message: 'Login successful',
          ...authData
        })
      } catch (error) {
        next(error)
      }
    })(req, res, next)
  }

  async logout(req, res, next) {
    try {
      await this.authService.destroySession(req.session.id)
      req.session.destroy()
      res.clearCookie('take-flight.sid')
      
      res.json({ message: 'Logout successful' })
    } catch (error) {
      next(error)
    }
  }

  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body
      
      const user = await this.authService.registerUser({
        email,
        password,
        firstName,
        lastName
      })

      res.status(201).json({
        message: 'Registration successful',
        userId: user.id
      })
    } catch (error) {
      next(error)
    }
  }

  async generateApiToken(req, res, next) {
    try {
      const { serviceId, scopes } = req.body
      
      // Only authenticated admin users can generate API tokens
      if (!req.session.user?.isAdmin) {
        return res.status(403).json({ 
          message: 'Unauthorized to generate API tokens' 
        })
      }

      const token = await this.authService.generateApiToken(serviceId, scopes)
      
      res.json({ token })
    } catch (error) {
      next(error)
    }
  }

  async refreshToken(req, res, next) {
    try {
      const { refreshToken } = req.body
      
      const newTokens = await this.authService.refreshTokens(refreshToken)
      
      res.json(newTokens)
    } catch (error) {
      next(error)
    }
  }
}