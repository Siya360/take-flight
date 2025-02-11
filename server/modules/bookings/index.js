// server/modules/bookings/index.js
export { BookingModel, BOOKING_STATUS, PAYMENT_STATUS } from './bookingsModel.js'
export { BookingService } from './bookingsService.js'

export const BOOKING_EVENTS = {
  BOOKING_CREATED: 'booking.created',
  BOOKING_UPDATED: 'booking.updated',
  BOOKING_CANCELLED: 'booking.cancelled',
  PAYMENT_UPDATED: 'booking.payment.updated'
}
