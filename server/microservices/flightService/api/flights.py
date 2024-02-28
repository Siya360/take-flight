from flask import Flask, request, jsonify, abort
import requests
import os
import logging
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type
from functools import wraps
from pybreaker import CircuitBreaker
import pybreaker

# Load configuration and establish a logging mechanism
from .. import config
logging.basicConfig(filename='flight_service.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s - [%(user)s - %(request_id)s]')

app = Flask(__name__)

# Circuit breaker instance
cb = CircuitBreaker(fail_max=3, reset_timeout=60)

# Skyscanner API key
SKYSCANNER_API_KEY = os.getenv('SKYSCANNER_API_KEY')

# Skyscanner API error message
SKYSCANNER_API_ERROR_MSG = 'Error from Skyscanner API: %s'

# Helper functions
def generate_request_id():
    import time
    return str(int(time.time()))

def skyscanner_api_call(method, url, headers, payload=None):
    """Encapsulates Skyscanner API calls with retries and circuit breaker"""
    @cb
    @retry(
        stop=stop_after_attempt(config.SKYSCANNER_MAX_RETRIES),
        wait=wait_exponential(multiplier=1, min=config.SKYSCANNER_BASE_WAIT_SECONDS, max=30),
        retry=retry_if_exception_type(requests.exceptions.RequestException),
        reraise=True
    )
    def _make_request():
        if method == 'POST':
            response = requests.post(url, headers=headers, json=payload)
        else:
            response = requests.get(url, headers=headers)
        response.raise_for_status()  
        return response

    return _make_request()

# Error handling
@app.errorhandler(400)  # Bad Request
def handle_bad_request(error):
    return jsonify({'error': error.description}), 400

def handle_skyscanner_error(err):
    logging.error(SKYSCANNER_API_ERROR_MSG, err, exc_info=True) # Include exception info too
    # Define retryable status codes as a list
    retryable_status_codes = [500, 502, 503, 429]

    if err.response.status_code in retryable_status_codes:
        raise err  # Retrying will be handled by @retry decorator

    elif err.response is None and isinstance(err, pybreaker.CircuitBreakerError):
        # Circuit breaker open
        return jsonify({'error': 'Temporary Issue with Skyscanner: Service currently unavailable. Please try again later.'}), 503

    elif err.response.status_code == 400:
        return jsonify({'error': 'Bad Request: There seems to be a problem with your search request. Please double-check your destination and dates.'}), 400

    elif err.response.status_code == 401:
        return jsonify({'error': 'Authentication failed: Please check your Skyscanner API key.'}), 401

    elif err.response.status_code == 403:
        return jsonify({'error': 'Forbidden: Access restricted. You may not have the required permissions. Try again later.'}), 403

    elif err.response.status_code == 404:
        return jsonify({'error': 'Flight information not found. Please revise your search criteria.'}), 404

    elif err.response.status_code == 429:
        return jsonify({'error': 'Too Many Requests: You have exceeded your rate limit. Please try again in a few minutes.'}), 429

    else:  # For 500 and other potential errors
        return jsonify({'error': 'Internal Server Error: Something went wrong with the Skyscanner API. Please try again later.'}), 500 # ... (Existing logic for handling Skyscanner-specific errors)

# Flight search endpoints
@app.route('/search/create', methods=['POST'])
def search_flights():
    payload = request.json  # Define payload here
    
    # Validate the payload and raise an InvalidQueryError if the payload is invalid
    if not payload or not payload.get('query'):
        abort(400, description="There seems to be a problem with your flight search. Please double-check your destination and travel dates.") 

    try: # Make request to Skyscanner API /create endpoint
        create_response = skyscanner_api_call(
            'POST',
            'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create',
            { 'Content-Type': 'application/json', 'x-api-key': SKYSCANNER_API_KEY },
            payload
        )
        logging.info('Search request successful')

        create_response.raise_for_status() # Raise an exception for non-200 status code
    
    except requests.exceptions.HTTPError as err:
        logging.error(SKYSCANNER_API_ERROR_MSG, err)
        return handle_skyscanner_error(err)

    # If successful; directly return the status code and response from the Skyscanner API
    return jsonify({
        'status_code': create_response.status_code,
        'response_body': create_response.json()  # Assuming the response is JSON
    }), create_response.status_code

@app.route('/search/poll/<session_token>', methods=['POST'])
def poll_flights(session_token):
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': SKYSCANNER_API_KEY
    }

    # Construct the correct polling endpoint URL with the session token
    poll_url = f'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/poll/{session_token}'
    try:
    # Make the polling request
        poll_response = skyscanner_api_call('POST', poll_url, headers, None)
        logging.info('Polling request successful')
        poll_response.raise_for_status()

    except requests.exceptions.HTTPError as err:
        logging.error('Error from Skyscanner API: %s', err)
        return handle_skyscanner_error(err)

    # if successful continue
    return jsonify(poll_response.json()), 200

if __name__ == '__main__':
    app.run(debug=True)
