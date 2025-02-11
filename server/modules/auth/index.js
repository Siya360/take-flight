// server/modules/auth/index.js
export { AuthService } from './authService.js'
export { jwtAuth } from './middleware/jwtAuth.js'
export { sessionAuth, loginRateLimit } from './middleware/sessionAuth.js'
export { configureJwtStrategy } from './strategies/jwtStrategy.js'


