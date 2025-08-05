# syntax=docker/dockerfile:1

eowdrd-codex/review-codebase-for-agentic-ai-migration
FROM golang:1.24-alpine AS build
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
