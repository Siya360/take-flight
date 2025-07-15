# API Overview

The server exposes a RESTful API under the `/api` prefix. Below is a summary of the main routes.

## Authentication

| Method | Path | Description |
| ------ | ---- | ----------- |
| `POST` | `/api/auth/login` | Authenticate a user and return JWT tokens. |
| `POST` | `/api/auth/register` | Create a new user account. |
| `POST` | `/api/auth/refresh-token` | Obtain a fresh access token using a refresh token. |
| `POST` | `/api/auth/logout` | Invalidate the current user's token. |

## Users

(Requires authentication)

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/api/users` | List users. Supports `page` and `page_size` query params. |
| `GET` | `/api/users/:id` | Retrieve a single user. |
| `PUT` | `/api/users/:id` | Update user information. |
| `DELETE` | `/api/users/:id` | Delete a user. |

## Flights

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/api/flights` | Search for flights. |
| `GET` | `/api/flights/:id` | Get a flight by ID. |
| `POST` | `/api/flights` | Create a new flight (admin only). |
| `PUT` | `/api/flights/:id` | Update flight details (admin only). |
| `DELETE` | `/api/flights/:id` | Delete a flight (admin only). |

## Bookings

(Requires authentication)

| Method | Path | Description |
| ------ | ---- | ----------- |
| `POST` | `/api/bookings` | Create a booking for a flight. |
| `GET` | `/api/bookings` | Search bookings for the current user. |
| `GET` | `/api/bookings/:id` | Retrieve booking details. |
| `PUT` | `/api/bookings/:id` | Update a booking. |
| `POST` | `/api/bookings/:id/cancel` | Cancel a booking. |

## Admin

(Requires admin role)

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/api/admin/dashboard` | Returns high level statistics. |
| `PUT` | `/api/admin/config` | Update system configuration. |
| `GET` | `/api/admin/revenue` | Revenue statistics for a date range. |
| `GET` | `/api/admin/metrics` | System metrics information. |
| `GET` | `/api/admin/activities` | Recent admin activities. |
| `PUT` | `/api/admin/notifications` | Update notification settings. |

