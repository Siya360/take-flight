# Auth Service

Standalone microservice providing authentication APIs for the Take Flight platform.

## Development

```bash
go run ./cmd
```

The service exposes a `GET /health` endpoint returning `{ "status": "ok" }` for health checks.
