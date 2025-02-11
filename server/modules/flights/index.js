// server/modules/flights/index.js
export { FlightModel, FLIGHT_STATUS } from './flightsModel.js'
export { FlightService } from './flightsService.js'

// Export any additional flight-related constants
export const FLIGHT_SEARCH_DEFAULTS = {
  limit: 10,
  offset: 0,
  sortBy: 'departureTime',
  sortOrder: 'asc'
}

export const FLIGHT_EVENTS = {
  FLIGHT_CREATED: 'flight.created',
  FLIGHT_UPDATED: 'flight.updated',
  FLIGHT_CANCELLED: 'flight.cancelled',
  FLIGHT_DELAYED: 'flight.delayed',
  SEAT_BOOKED: 'flight.seat.booked',
  SEAT_CANCELLED: 'flight.seat.cancelled'
}
