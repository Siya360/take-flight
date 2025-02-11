// server/modules/auth/middleware/jwtAuth.js
import jwt from 'jsonwebtoken'

export const jwtAuth = (req, res, next) => {
  try {
    // Extract token from Authorization header
    const token = req.headers.authorization?.split(' ')[1]
    
    if (!token) {
      return res.status(401).json({ 
        message: 'Authentication token is missing' 
      })
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Add decoded token to request object
    req.user = decoded
    req.tokenType = 'jwt'
    
    next()
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        message: 'Invalid token' 
      })
    }
    
    next(error)
  }
}
