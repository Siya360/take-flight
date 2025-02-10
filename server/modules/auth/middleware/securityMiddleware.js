// server/modules/auth/middleware/securityMiddleware.js
import rateLimit from 'express-rate-limit'
import helmet from 'helmet'

export const securityMiddleware = [
  // Basic security headers
  helmet(),
  
  // Rate limiting for API routes
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later'
  }),
  
  // Custom security middleware
  (req, res, next) => {
    // Remove sensitive headers
    res.removeHeader('X-Powered-By')
    next()
  }
]