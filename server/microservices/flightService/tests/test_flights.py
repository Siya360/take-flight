# server/microservices/flightService/tests/test_flights.py

import unittest
from unittest.mock import patch
from ..api.flights import generate_request_id, handle_bad_request, handle_skyscanner_error # Import your functions 

class TestFlights(unittest.TestCase):

    # Tests for 'generate_request_id' function
    def test_generate_request_id_uniqueness(self):
        """Tests that generated request IDs are unique"""
        id1 = generate_request_id()
        id2 = generate_request_id()
        self.assertNotEqual(id1, id2)

    # Tests for 'handle_bad_request' function
    def test_handle_bad_request_missing_data(self):
        """Tests handling of a bad request with missing payload"""
        error = ValueError("Missing flight search payload")  # Simulate your error
        result = handle_bad_request(error)
        self.assertEqual(result.status_code, 400) 
        # ... more assertions on the error message

    # Tests for 'handle_skyscanner_error' function
    @patch('requests.exceptions.HTTPError')  # Mock HTTPError
    def test_handle_skyscanner_error_rate_limit(self, mock_http_error):
        """Tests handling of a 429 rate limit error from Skyscanner"""
        mock_response = unittest.mock.Mock()
        mock_response.status_code = 429
        mock_http_error.response = mock_response

        result = handle_skyscanner_error(mock_http_error)
        self.assertEqual(result.status_code, 429)
        # ... more assertions on the error message

    if __name__ == '__main__':
        unittest.main()
