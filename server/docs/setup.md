# Setup

This guide covers the steps required to prepare a development environment for Take Flight.

## Prerequisites

- Go 1.22 or newer
- MongoDB and Redis servers running locally or accessible in your network

## Installing Dependencies

Clone the repository and fetch dependencies:

```bash
git clone <repo>
cd take-flight/server
go mod download
```

## Configuration

All runtime settings are stored in `configs/app.yaml`. A sample file is provided:

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

Adjust the values as needed for your environment. The application expects the file path to be provided via the `--config` flag when starting the server.

## Building the Binary

From the `server` directory run:

```bash
go build -o bin/take-flight ./cmd/api
```

Running `go vet ./...` beforehand is a good way to catch potential issues.

