// server/modules/auth/middleware/roleAuth.js

export const isAdmin = (req, res, next) => {
    if (!req.session?.user?.role == 'admin') {
      return res.status(403).json({ 
        message: 'Admin access required' 
      })
    }
    next()
  }