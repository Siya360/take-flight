# Deployment

This document describes how to run the compiled server in different environments.

## Local Execution

After building the binary you can run it directly:

```bash
./bin/take-flight --config configs/app.yaml
```

The `--config` flag should point to the YAML file that contains your environment specific configuration.

## Docker (optional)

You can also containerise the server. A minimal example using Docker:

```Dockerfile
FROM golang:1.22-alpine AS build
WORKDIR /src
COPY . .
RUN cd server && go build -o /app/take-flight ./cmd/api

FROM alpine
COPY --from=build /app/take-flight /usr/local/bin/take-flight
COPY server/configs/app.yaml /etc/take-flight/app.yaml
CMD ["take-flight", "--config", "/etc/take-flight/app.yaml"]
```

Build and run:

```bash
docker build -t take-flight .
docker run -p 8080:8080 take-flight
```

Adjust the configuration volume or environment to suit your deployment.

