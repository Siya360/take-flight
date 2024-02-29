# server/microservices/flightService/api/api_errors.py

class ApiError(Exception):
    """Base class for all API-related errors"""
    def __init__(self, message, status_code=None):
        super().__init__(message)
        self.message = message
        self.status_code = status_code or 500  # Default to Internal Server Error

class InvalidSearchQueryError(ApiError):
    """Indicates an issue with the user's flight search query"""
    def __init__(self, message):
        super().__init__(message, status_code=400)

class DestinationNotFoundError(ApiError):
    """Indicates that the specified destination could not be found"""
    def __init__(self, message):
        super().__init__(message, status_code=400)

# Add more error classes as needed ...
