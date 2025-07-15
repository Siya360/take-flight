# take-flight

Take Flight is a proof-of-concept flight booking API written in Go. The project exposes a REST interface for authentication, booking flights and basic administration tasks.

## Requirements

- Go 1.22+
- MongoDB and Redis instances (local installations are fine for development)

## Setup

See [server/docs/setup.md](server/docs/setup.md) for full instructions. In short:

```bash
# get dependencies
cd server
go mod download

# adjust configuration
cp configs/app.yaml configs/app.local.yaml  # edit values as needed
```

## Building

Compile the API binary from the `server` directory:

```bash
cd server
go build -o bin/take-flight ./cmd/api
```

## Running

Run the server with your configuration file:

```bash
./bin/take-flight --config configs/app.yaml
```

You can also run it directly via `go run`:

```bash
cd server
go run ./cmd/api --config configs/app.yaml
```

## Docker

The repository includes a `Dockerfile` and `docker-compose.yml` for a containerised
setup. Build and run the API along with MongoDB and Redis using:

```bash
docker compose up --build
```

The server will be available on [http://localhost:8080](http://localhost:8080).

## Configuration

The file `server/configs/app.yaml` contains all runtime settings. Below is an example configuration:

```yaml
server:
  host: 0.0.0.0
  port: 8080
mongodb:
  uri: mongodb://localhost:27017
  database: takeflight
redis:
  host: localhost
  port: 6379
  password: ""
  db: 0
jwt:
  secret: example-secret
  expireHours: 24
  refreshSecret: example-refresh-secret
  refreshTTL: 168h
```

## Contribution Guidelines

Contributions are welcome! Please open an issue before submitting a pull request so we can discuss the change. When contributing:

1. Ensure `go vet ./...` and `go build ./cmd/api` run without errors.
2. Format Go code with `gofmt`.
3. Update or add tests where appropriate.
4. Document any new features in `server/docs`.

