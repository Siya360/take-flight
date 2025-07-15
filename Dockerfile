FROM golang:1.22-alpine AS build
WORKDIR /src
COPY . .
RUN cd server && go build -o /app/take-flight ./cmd/api

FROM alpine
WORKDIR /app
COPY --from=build /app/take-flight ./take-flight
COPY server/configs/app.yaml /etc/take-flight/app.yaml
EXPOSE 8080
CMD ["/app/take-flight", "--config", "/etc/take-flight/app.yaml"]
