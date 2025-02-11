// server/modules/bookings/bookingsModel.js
export class BookingModel {
  constructor(data) {
    this.id = data.id
    this.userId = data.userId
    this.flightId = data.flightId
    this.status = data.status || BOOKING_STATUS.PENDING
    this.passengerDetails = data.passengerDetails || []
    this.totalPrice = data.totalPrice
    this.paymentStatus = data.paymentStatus || PAYMENT_STATUS.PENDING
    this.bookingReference = data.bookingReference || this.generateBookingReference()
    this.createdAt = data.createdAt || new Date()
    this.updatedAt = data.updatedAt || new Date()
  }

  // Static methods for data validation
  static validateCreatePayload(data) {
    const requiredFields = ['userId', 'flightId', 'passengerDetails', 'totalPrice']
    const missingFields = requiredFields.filter(field => !data[field])
    
    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`)
    }

    // Validate passenger details
    if (!Array.isArray(data.passengerDetails) || data.passengerDetails.length === 0) {
      throw new Error('Passenger details must be a non-empty array')
    }

    data.passengerDetails.forEach((passenger, index) => {
      const requiredPassengerFields = ['firstName', 'lastName', 'passport']
      const missingPassengerFields = requiredPassengerFields.filter(field => !passenger[field])
      
      if (missingPassengerFields.length > 0) {
        throw new Error(`Missing passenger fields for passenger ${index + 1}: ${missingPassengerFields.join(', ')}`)
      }
    })

    // Validate price
    if (typeof data.totalPrice !== 'number' || data.totalPrice <= 0) {
      throw new Error('Total price must be a positive number')
    }

    return true
  }

  // Generate unique booking reference
  generateBookingReference() {
    const prefix = 'BK'
    const timestamp = Date.now().toString(36).toUpperCase()
    const random = Math.random().toString(36).substring(2, 5).toUpperCase()
    return `${prefix}${timestamp}${random}`
  }

  // Instance methods
  isModifiable() {
    return [BOOKING_STATUS.PENDING, BOOKING_STATUS.CONFIRMED].includes(this.status)
  }

  isCancellable() {
    return this.status !== BOOKING_STATUS.CANCELLED && 
           this.status !== BOOKING_STATUS.COMPLETED
  }

  toJSON() {
    return {
      ...this,
      isModifiable: this.isModifiable(),
      isCancellable: this.isCancellable()
    }
  }
}

export const BOOKING_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED'
}

export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
}
