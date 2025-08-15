# take-flight

Take Flight is a full-stack, microservice-based flight management platform. The system features a React frontend with Go microservices for each domain (authentication, users, flights, bookings, and admin), plus a Python orchestrator that coordinates higher-level workflows for AI agents.

## Services

| Service              | Language | Directory             | Default Port |
| -------------------- | -------- | --------------------- | ------------ |
| **Backend Services** |
| Auth                 | Go       | `services/auth`       | 8081         |
| Users                | Go       | `services/users`      | 8082         |
| Flights              | Go       | `services/flights`    | 8083         |
| Bookings             | Go       | `services/bookings`   | 8084         |
| Admin                | Go       | `services/admin`      | 8085         |
| Orchestrator         | Python   | `agents/orchestrator` | 8090         |
| **Frontend**         |
| Frontend             | React/TS | `frontend/`           | 3000         |

Each Go service exposes a `/health` endpoint using Echo. The orchestrator uses FastAPI to host LangChain agents.

## Development Requirements

- Go 1.22+
- Python 3.11+
- Node.js 18+ (for frontend)
- Bun or Yarn (frontend package managers)
- Docker (optional for containerized workflow)

## Building Services

Compile any service individually, e.g. the auth service:

```bash
go build -o /tmp/auth ./services/auth/cmd
```

The Python orchestrator can be checked with:

```bash
python -m py_compile agents/orchestrator/main.py
```

### Frontend Development

Install frontend dependencies:

```bash
cd frontend
# Using bun (recommended)
bun install
# OR using yarn
yarn install
```

Start the frontend development server:

```bash
# Using bun
bun dev
# OR using yarn
yarn dev
```

Build the frontend for production:

```bash
# Using bun
bun run build
# OR using yarn
yarn build
```

The frontend uses environment variables to connect to backend services. Copy `frontend/.env.example` to `frontend/.env` and adjust URLs as needed for local development.

### Amadeus API

The flights service fetches live data from the Amadeus API. Obtain credentials from [Amadeus for Developers](https://developers.amadeus.com/) and set them in your environment:

```bash
export AMADEUS_CLIENT_ID=your_client_id
export AMADEUS_CLIENT_SECRET=your_client_secret
```

## Docker Compose

The repository includes a `docker-compose.yml` that builds all services and supporting dependencies.
Start the stack with:

```bash
docker compose up --build
```

Service endpoints will be available on `localhost` using the ports listed above.

## Supporting Infrastructure

The compose file also starts supporting services for persistence, caching, and messaging:

| Service | Purpose        | Default Port |
| ------- | -------------- | ------------ |
| MongoDB | Document store | 27017        |
| Redis   | Cache          | 6379         |
| NATS    | Message broker | 4222         |

## Contribution Guidelines

Contributions are welcome! Please open an issue before submitting a pull request so we can discuss the change. When contributing:

1. Ensure `go vet ./...` and `go build` for the affected service run without errors.
2. Format Go code with `gofmt` and Python code with `black` or `ruff` (future).
3. Update or add tests where appropriate.
4. Document any new features in `README.md` or service-specific docs.
