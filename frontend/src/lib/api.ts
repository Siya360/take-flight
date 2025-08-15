// API service for backend communication
const API_BASE_URL = import.meta.env.VITE_API_FLIGHTS_URL || 'http://localhost:8083';
const ORCHESTRATOR_URL = import.meta.env.VITE_API_ORCHESTRATOR_URL || 'http://localhost:8090';

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: string;
  isRoundTrip: boolean;
}

export interface FlightBookingRequest {
  flightId: string;
  passengers: number;
  passengerDetails?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  }[];
}

// Search flights via the Go flights service
export const searchFlights = async (searchParams: FlightSearchRequest) => {
  try {
    const params = new URLSearchParams({
      origin: searchParams.origin,
      destination: searchParams.destination,
      departureDate: searchParams.departureDate,
      adults: searchParams.passengers.toString(),
    });

    const response = await fetch(`${API_BASE_URL}/flights/search?${params}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Flight search failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error searching flights:', error);
    throw error;
  }
};

// Get flight details via the Go flights service
export const getFlightDetails = async (flightId: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/flights/${flightId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Flight details fetch failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching flight details:', error);
    throw error;
  }
};

// Book a flight via the orchestrator (agentic layer)
export const bookFlight = async (bookingData: FlightBookingRequest) => {
  try {
    const response = await fetch(`${ORCHESTRATOR_URL}/bookings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      throw new Error(`Flight booking failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error booking flight:', error);
    throw error;
  }
};

// Health check for services
export const checkServiceHealth = async (serviceUrl: string) => {
  try {
    const response = await fetch(`${serviceUrl}/health`);
    return response.ok;
  } catch (error) {
    console.error(`Health check failed for ${serviceUrl}:`, error);
    return false;
  }
};

// Check if all services are healthy
export const checkAllServicesHealth = async () => {
  const services = [
    { name: 'flights', url: API_BASE_URL },
    { name: 'orchestrator', url: ORCHESTRATOR_URL },
  ];

  const healthResults = await Promise.allSettled(
    services.map(async (service) => ({
      name: service.name,
      healthy: await checkServiceHealth(service.url),
      url: service.url,
    }))
  );

  return healthResults.map((result, index) => 
    result.status === 'fulfilled' 
      ? result.value 
      : { name: services[index].name, healthy: false, url: services[index].url }
  );
};
