// server/modules/flights/flightsService.js

// Import the AuthService
import { AuthService } from '../../auth/authService'

// FlightsService class
export class FlightsService {
  constructor() {
    // Initialize the AuthService
    this.authService = new AuthService()
  }

  // Example of a method that needs to call an external API (like Skyscanner)
  async searchExternalFlights(searchParams) {
    try {
      // Get an API token for external service
      const apiToken = await this.authService.getExternalApiToken('skyscanner')
      
      // Use the token to make authenticated requests
      const response = await fetch('https://api.skyscanner.com/flights/search', {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(searchParams)
      })

      return await response.json()
    } catch (error) {
      console.error('Error searching external flights:', error)
      throw error
    }
  }

  // Example of a method that checks user authentication
  async getUserBookings(userId) {
    // The userId comes from the authenticated session
    // We don't need to check auth here because the controller
    // already enforced it with requireSession middleware
    return await this.flightsRepository.findByUserId(userId)
  }
}