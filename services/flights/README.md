# Flights Service

Standalone microservice providing flight schedule and inventory APIs for the Take Flight platform.

## Development

```bash
go run ./cmd
```

The service exposes:

- `GET /health` returning `{ "status": "ok" }`
- `GET /flights/search?origin=JFK&destination=LAX&departureDate=2025-09-01` fetching live flight offers from Amadeus

### Configuration

Set Amadeus credentials before running:

```bash
export AMADEUS_CLIENT_ID=your_client_id
export AMADEUS_CLIENT_SECRET=your_client_secret
```

