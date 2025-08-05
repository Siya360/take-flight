# syntax=docker/dockerfile:1
mkgc9h-codex/review-codebase-for-agentic-ai-migration
FROM golang:1.22-alpine AS build
main
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o auth ./cmd

FROM alpine:3.19
WORKDIR /root/
COPY --from=build /app/auth .
EXPOSE 8080
CMD ["./auth"]
