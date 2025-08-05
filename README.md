# take-flight

Take Flight is evolving into a microservice-based flight management platform. Each domain (authentication, users, flights,
bookings, and admin) runs as an independent Go service while a Python orchestrator coordinates higher-level workflows for AI agents.

## Services

| Service       | Language | Directory                 | Default Port |
|---------------|----------|---------------------------|--------------|
| Auth          | Go       | `services/auth`           | 8081         |
| Users         | Go       | `services/users`          | 8082         |
| Flights       | Go       | `services/flights`        | 8083         |
| Bookings      | Go       | `services/bookings`       | 8084         |
| Admin         | Go       | `services/admin`          | 8085         |
| Orchestrator  | Python   | `agents/orchestrator`     | 8090         |


Each Go service exposes a `/health` endpoint using Echo. The orchestrator uses FastAPI to host LangChain agents.

## Development Requirements

- Go 1.22+
- Python 3.11+
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

## Docker Compose

The repository includes a `docker-compose.yml` that builds all services and supporting dependencies.
Start the stack with:

```bash
docker compose up --build
```

Service endpoints will be available on `localhost` using the ports listed above.

## Supporting Infrastructure
main

The compose file also starts supporting services for persistence, caching, and messaging:


| Service  | Purpose          | Default Port |
|----------|------------------|--------------|
| MongoDB  | Document store   | 27017        |
| Redis    | Cache            | 6379         |
| NATS     | Message broker   | 4222         |

main

## Contribution Guidelines

Contributions are welcome! Please open an issue before submitting a pull request so we can discuss the change. When contributing:

1. Ensure `go vet ./...` and `go build` for the affected service run without errors.
2. Format Go code with `gofmt` and Python code with `black` or `ruff` (future).
3. Update or add tests where appropriate.
4. Document any new features in `README.md` or service-specific docs.

