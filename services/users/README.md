# Users Service

Standalone microservice providing user management APIs for the Take Flight platform.

## Development

```bash
go run ./cmd
```

The service exposes a `GET /health` endpoint returning:

```json
{"status": "ok"}
```

for health checks.
