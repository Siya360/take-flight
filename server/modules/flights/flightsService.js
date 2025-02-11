// server/modules/flights/flightsService.js
import { FlightModel, FLIGHT_STATUS, FLIGHT_EVENTS } from './index.js'
import { AuthService } from '../auth/index.js'

export class FlightService {
  constructor() {
    this.authService = new AuthService()
    // In a real application, you would inject a database connection
    this.flights = new Map() // Temporary in-memory storage
    this.eventListeners = new Map() // For handling flight events
  }

  // CRUD Operations
  async create(flightData) {
    try {
      // Validate flight data
      FlightModel.validateCreatePayload(flightData)

      // Check for duplicate flight number
      const existingFlight = await this.findByFlightNumber(flightData.flightNumber)
      if (existingFlight) {
        throw new Error('Flight number already exists')
      }

      // Create new flight instance
      const flight = new FlightModel({
        id: Date.now().toString(), // Temporary ID generation
        ...flightData
      })

      // Save flight
      this.flights.set(flight.id, flight)

      // Emit flight created event
      this.emitEvent(FLIGHT_EVENTS.FLIGHT_CREATED, flight)

      return flight.toJSON()
    } catch (error) {
      throw new Error(`Error creating flight: ${error.message}`)
    }
  }

  async findById(id) {
    const flight = this.flights.get(id)
    return flight ? flight.toJSON() : null
  }

  async findByFlightNumber(flightNumber) {
    for (const flight of this.flights.values()) {
      if (flight.flightNumber === flightNumber) {
        return flight
      }
    }
    return null
  }

  async search(params) {
    try {
      let filteredFlights = Array.from(this.flights.values())

      // Apply filters
      if (params.departureCity) {
        filteredFlights = filteredFlights.filter(
          flight => flight.departureCity.toLowerCase() === params.departureCity.toLowerCase()
        )
      }

      if (params.arrivalCity) {
        filteredFlights = filteredFlights.filter(
          flight => flight.arrivalCity.toLowerCase() === params.arrivalCity.toLowerCase()
        )
      }

      if (params.departureDate) {
        const date = new Date(params.departureDate)
        filteredFlights = filteredFlights.filter(flight => {
          const flightDate = new Date(flight.departureTime)
          return flightDate.toDateString() === date.toDateString()
        })
      }

      if (params.maxPrice) {
        filteredFlights = filteredFlights.filter(
          flight => flight.price <= params.maxPrice
        )
      }

      // Sort results
      const sortBy = params.sortBy || 'departureTime'
      const sortOrder = params.sortOrder || 'asc'

      filteredFlights.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortBy] > b[sortBy] ? 1 : -1
        }
        return a[sortBy] < b[sortBy] ? 1 : -1
      })

      // Paginate results
      const offset = params.offset || 0
      const limit = params.limit || 10
      const paginatedFlights = filteredFlights.slice(offset, offset + limit)

      return {
        flights: paginatedFlights.map(flight => flight.toJSON()),
        total: filteredFlights.length,
        offset,
        limit
      }
    } catch (error) {
      throw new Error(`Error searching flights: ${error.message}`)
    }
  }

  async update(id, updateData) {
    const flight = this.flights.get(id)
    if (!flight) {
      throw new Error('Flight not found')
    }

    // Don't allow updating certain fields
    delete updateData.id
    delete updateData.flightNumber
    delete updateData.createdAt

    // Update status if provided
    if (updateData.status && !Object.values(FLIGHT_STATUS).includes(updateData.status)) {
      throw new Error('Invalid flight status')
    }

    // Check if updating departure/arrival times
    if (updateData.departureTime || updateData.arrivalTime) {
      const newDeparture = updateData.departureTime ? new Date(updateData.departureTime) : flight.departureTime
      const newArrival = updateData.arrivalTime ? new Date(updateData.arrivalTime) : flight.arrivalTime

      if (newDeparture >= newArrival) {
        throw new Error('Departure time must be before arrival time')
      }
    }

    Object.assign(flight, {
      ...updateData,
      updatedAt: new Date()
    })

    this.flights.set(id, flight)

    // Emit appropriate event based on status change
    if (updateData.status === FLIGHT_STATUS.DELAYED) {
      this.emitEvent(FLIGHT_EVENTS.FLIGHT_DELAYED, flight)
    } else if (updateData.status === FLIGHT_STATUS.CANCELLED) {
      this.emitEvent(FLIGHT_EVENTS.FLIGHT_CANCELLED, flight)
    } else {
      this.emitEvent(FLIGHT_EVENTS.FLIGHT_UPDATED, flight)
    }

    return flight.toJSON()
  }

  async delete(id) {
    const exists = this.flights.has(id)
    if (!exists) {
      throw new Error('Flight not found')
    }

    this.flights.delete(id)
    return true
  }

  // Booking-related methods
  async checkAvailability(id) {
    const flight = this.flights.get(id)
    if (!flight) {
      throw new Error('Flight not found')
    }

    return {
      isAvailable: flight.isBookable(),
      availableSeats: flight.getAvailableSeats(),
      status: flight.status
    }
  }

  async reserveSeat(id) {
    const flight = this.flights.get(id)
    if (!flight) {
      throw new Error('Flight not found')
    }

    if (!flight.isBookable()) {
      throw new Error('Flight is not available for booking')
    }

    flight.bookedSeats += 1
    flight.updatedAt = new Date()

    this.flights.set(id, flight)
    this.emitEvent(FLIGHT_EVENTS.SEAT_BOOKED, flight)

    return flight.toJSON()
  }

  async cancelSeatReservation(id) {
    const flight = this.flights.get(id)
    if (!flight) {
      throw new Error('Flight not found')
    }

    if (flight.bookedSeats <= 0) {
      throw new Error('No seats booked for this flight')
    }

    flight.bookedSeats -= 1
    flight.updatedAt = new Date()

    this.flights.set(id, flight)
    this.emitEvent(FLIGHT_EVENTS.SEAT_CANCELLED, flight)

    return flight.toJSON()
  }

  // Event handling methods
  addEventListener(eventName, listener) {
    if (!this.eventListeners.has(eventName)) {
      this.eventListeners.set(eventName, new Set())
    }
    this.eventListeners.get(eventName).add(listener)
  }

  removeEventListener(eventName, listener) {
    const listeners = this.eventListeners.get(eventName)
    if (listeners) {
      listeners.delete(listener)
    }
  }

  emitEvent(eventName, data) {
    const listeners = this.eventListeners.get(eventName)
    if (listeners) {
      listeners.forEach(listener => listener(data))
    }
  }
}
