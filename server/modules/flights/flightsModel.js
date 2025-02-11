// server/modules/flights/flightsModel.js
export class FlightModel {
  constructor(data) {
    this.id = data.id
    this.flightNumber = data.flightNumber
    this.airline = data.airline
    this.departureCity = data.departureCity
    this.arrivalCity = data.arrivalCity
    this.departureTime = new Date(data.departureTime)
    this.arrivalTime = new Date(data.arrivalTime)
    this.price = data.price
    this.capacity = data.capacity
    this.bookedSeats = data.bookedSeats || 0
    this.status = data.status || 'SCHEDULED' // SCHEDULED, DELAYED, CANCELLED, COMPLETED
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  // Static methods for data validation
  static validateCreatePayload(data) {
    const requiredFields = [
      'flightNumber',
      'airline',
      'departureCity',
      'arrivalCity',
      'departureTime',
      'arrivalTime',
      'price',
      'capacity'
    ]

    const missingFields = requiredFields.filter(field => !data[field])
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }

    // Validate dates
    const departure = new Date(data.departureTime)
    const arrival = new Date(data.arrivalTime)
    
    if (isNaN(departure.getTime()) || isNaN(arrival.getTime())) {
      throw new Error('Invalid date format')
    }

    if (departure >= arrival) {
      throw new Error('Departure time must be before arrival time')
    }

    // Validate price and capacity
    if (data.price <= 0) {
      throw new Error('Price must be greater than 0')
    }

    if (data.capacity <= 0 || !Number.isInteger(data.capacity)) {
      throw new Error('Capacity must be a positive integer')
    }

    return true
  }

  // Instance methods
  hasAvailableSeats() {
    return this.bookedSeats < this.capacity
  }

  getAvailableSeats() {
    return this.capacity - this.bookedSeats
  }

  calculateDuration() {
    return (this.arrivalTime - this.departureTime) / (1000 * 60) // Duration in minutes
  }

  isBookable() {
    return (
      this.status === 'SCHEDULED' &&
      this.hasAvailableSeats() &&
      this.departureTime > new Date()
    )
  }

  toJSON() {
    return {
      ...this,
      availableSeats: this.getAvailableSeats(),
      duration: this.calculateDuration(),
      isBookable: this.isBookable()
    }
  }
}

export const FLIGHT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  DELAYED: 'DELAYED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
}
