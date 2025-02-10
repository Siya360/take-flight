// server/modules/flights/flightsController.js

import { Router } from 'express'
import { FlightsService } from './flightsService'
import { requireSession } from '../auth/middleware/sessionAuth'
import { jwtAuth } from '../auth/middleware/jwtAuth'

export class FlightsController {
  constructor() {
    this.router = Router()
    this.flightsService = new FlightsService()
    this.initializeRoutes()
  }

  initializeRoutes() {
    // Public routes
    this.router.get('/search', this.searchFlights.bind(this))
    
    // Session-protected routes (for web application)
    this.router.get('/bookings', requireSession, this.getUserBookings.bind(this))
    this.router.post('/book', requireSession, this.bookFlight.bind(this))
    
    // JWT-protected routes (for external APIs)
    this.router.get('/api/availability', jwtAuth, this.checkAvailability.bind(this))
    this.router.post('/api/bulk-booking', jwtAuth, this.bulkBooking.bind(this))
  }

  async searchFlights(req, res, next) {
    try {
      const { origin, destination, date } = req.query
      const flights = await this.flightsService.searchFlights({
        origin,
        destination,
        date
      })
      
      res.json(flights)
    } catch (error) {
      next(error)
    }
  }

  // Other controller methods...
}