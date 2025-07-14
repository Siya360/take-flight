# take-flight

This repository hosts a Go based API server.

## Building

Ensure [Go](https://go.dev/doc/install) 1.22 or newer is available.
Run the following from the `server` directory to compile the API binary:

```bash
cd server
go build -o bin/take-flight ./cmd/api
```

## Running

After building you can start the server with:

```bash
./bin/take-flight --config configs/app.yaml
```

Or run directly with `go run`:

```bash
cd server
go run ./cmd/api --config configs/app.yaml
```
