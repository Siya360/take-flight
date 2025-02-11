// server/modules/auth/middleware/sessionAuth.js

import { redisClient } from '../session/redisStore.js'

export const sessionAuth = async (req, res, next) => {
  try {
    if (!req.session?.userId) {
      return res.status(401).json({ 
        message: 'Authentication required' 
      })
    }

    // Verify session exists in Redis
    const sessionKey = `session:${req.session.id}`
    const sessionExists = await redisClient.exists(sessionKey)
    
    if (!sessionExists) {
      return res.status(401).json({ 
        message: 'Session expired' 
      })
    }

    // Add session type identifier
    req.tokenType = 'session'
    
    next()
  } catch (error) {
    next(error)
  }
}

// Optional: Rate limiting middleware for login attempts
export const loginRateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many login attempts, please try again later'
}
