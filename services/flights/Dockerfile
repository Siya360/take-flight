# syntax=docker/dockerfile:1

FROM golang:1.22-alpine AS build
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o flights ./cmd

FROM alpine:3.19
WORKDIR /root/
COPY --from=build /app/flights .
EXPOSE 8080
CMD ["./flights"]
