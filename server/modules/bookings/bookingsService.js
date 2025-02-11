// server/modules/bookings/bookingsService.js
import { BookingModel, BOOKING_STATUS, PAYMENT_STATUS } from './bookingsModel.js'
import { FlightService } from '../flights/flightsService.js'
import { UserService } from '../users/usersService.js'

export class BookingService {
  constructor() {
    this.flightService = new FlightService()
    this.userService = new UserService()
    this.bookings = new Map() // Temporary in-memory storage
  }

  async create(bookingData) {
    try {
      // Validate booking data
      BookingModel.validateCreatePayload(bookingData)

      // Verify user exists
      const user = await this.userService.findById(bookingData.userId)
      if (!user) {
        throw new Error('User not found')
      }

      // Check flight availability
      const flight = await this.flightService.findById(bookingData.flightId)
      if (!flight) {
        throw new Error('Flight not found')
      }

      const availability = await this.flightService.checkAvailability(bookingData.flightId)
      if (!availability.isAvailable) {
        throw new Error('Flight is not available for booking')
      }

      if (availability.availableSeats < bookingData.passengerDetails.length) {
        throw new Error('Not enough seats available')
      }

      // Create booking
      const booking = new BookingModel({
        id: Date.now().toString(), // Temporary ID generation
        ...bookingData
      })

      // Reserve seats using array length
      await Promise.all(
        Array(bookingData.passengerDetails.length)
          .fill(null)
          .map(() => this.flightService.reserveSeat(bookingData.flightId))
      )

      // Save booking
      this.bookings.set(booking.id, booking)

      return booking.toJSON()
    } catch (error) {
      throw new Error(`Error creating booking: ${error.message}`)
    }
  }

  async findById(id) {
    const booking = this.bookings.get(id)
    return booking ? booking.toJSON() : null
  }

  async findByUser(userId) {
    const userBookings = Array.from(this.bookings.values())
      .filter(booking => booking.userId === userId)
      .map(booking => booking.toJSON())

    return userBookings
  }

  async findByReference(reference) {
    for (const booking of this.bookings.values()) {
      if (booking.bookingReference === reference) {
        return booking.toJSON()
      }
    }
    return null
  }

  async update(id, updateData) {
    const booking = this.bookings.get(id)
    if (!booking) {
      throw new Error('Booking not found')
    }

    if (!booking.isModifiable()) {
      throw new Error('Booking cannot be modified')
    }

    // Don't allow updating certain fields
    delete updateData.id
    delete updateData.userId
    delete updateData.flightId
    delete updateData.bookingReference
    delete updateData.createdAt

    Object.assign(booking, {
      ...updateData,
      updatedAt: new Date()
    })

    this.bookings.set(id, booking)
    return booking.toJSON()
  }

  async cancel(id) {
    const booking = this.bookings.get(id)
    if (!booking) {
      throw new Error('Booking not found')
    }

    if (!booking.isCancellable()) {
      throw new Error('Booking cannot be cancelled')
    }

    // Release seats using array length
    await Promise.all(
      Array(booking.passengerDetails.length)
        .fill(null)
        .map(() => this.flightService.cancelSeatReservation(booking.flightId))
    )

    booking.status = BOOKING_STATUS.CANCELLED
    booking.updatedAt = new Date()

    this.bookings.set(id, booking)
    return booking.toJSON()
  }

  async updatePaymentStatus(id, paymentStatus) {
    const booking = this.bookings.get(id)
    if (!booking) {
      throw new Error('Booking not found')
    }

    if (!Object.values(PAYMENT_STATUS).includes(paymentStatus)) {
      throw new Error('Invalid payment status')
    }

    booking.paymentStatus = paymentStatus
    
    // Update booking status based on payment status
    if (paymentStatus === PAYMENT_STATUS.COMPLETED) {
      booking.status = BOOKING_STATUS.CONFIRMED
    } else if (paymentStatus === PAYMENT_STATUS.FAILED) {
      await this.cancel(id)
    }

    booking.updatedAt = new Date()
    this.bookings.set(id, booking)
    
    return booking.toJSON()
  }
}
