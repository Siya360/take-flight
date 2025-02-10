// server/src/index.js
import express from 'express'
import { sessionMiddleware } from '../modules/auth/middleware/sessionAuth'
import passport from 'passport'
import { configureLocalStrategy } from '../modules/auth/strategies/localStrategy'
import { configureJwtStrategy } from '../modules/auth/strategies/jwtStrategy'
import { AuthController } from '../modules/auth/authController'
import { FlightsController } from '../modules/flights/flightsController'
import { BookingsController } from '../modules/bookings/bookingsController'
import { UsersController } from '../modules/users/usersController'

const app = express()

// Basic middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(sessionMiddleware)

// Configure passport
app.use(passport.initialize())
app.use(passport.session())
configureLocalStrategy()
configureJwtStrategy()

// Initialize controllers
const authController = new AuthController()
const flightsController = new FlightsController()
const bookingsController = new BookingsController()
const usersController = new UsersController()

// Mount routes
app.use('/auth', authController.router)
app.use('/flights', flightsController.router)
app.use('/bookings', bookingsController.router)
app.use('/users', usersController.router)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

export default app