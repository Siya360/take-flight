# server/microservices/flightService/api/flights.py
from flask import Flask, request, jsonify
import requests
import os
from werkzeug.exceptions import HTTPException
import logging
from tenacity import retry, stop_after_attempt, wait_fixed, wait_random, retry_if_exception_type
from .. import config  # Import the config module from the parent package

SKYSCANNER_API_ERROR_MSG = 'Error from Skyscanner API: %s'

logging.basicConfig(filename='flight_service.log', level=logging.INFO)

app = Flask(__name__)

# Retrieve API key from environment variables
SKYSCANNER_API_KEY = os.getenv('SKYSCANNER_API_KEY')
class InvalidQueryError(HTTPException):
    code = 400
    description = 'There seems to be a problem with your flight search. Please double-check your destination and travel dates.'

# A general retry function for Skyscanner API requests
def on_backoff(details):
    print(f"Backing off {details['wait']:0.1f} seconds after {details['tries']} tries "
        f"calling {details['target']}")

def on_giveup(details):
    print(f"Max tries exceeded for {details['target']}. Giving up.")

@retry(
    stop=stop_after_attempt(config.SKYSCANNER_MAX_RETRIES),
    wait=wait_fixed(config.SKYSCANNER_BASE_WAIT_SECONDS) + wait_random(0, config.SKYSCANNER_MAX_JITTER_SECONDS), # Add jitter
    retry=retry_if_exception_type(requests.exceptions.RequestException),
    reraise=True, # Important for proper error handling
    before_sleep=on_backoff,
    after=on_giveup
)
def skyscanner_api_call(url, headers, payload=None):
    if payload:
        return requests.post(url, headers=headers, json=payload)
    else:
        return requests.post(url, headers=headers)

def on_backoff(details):
    logging.warning(f"Backing off {details['wait']:0.1f} seconds after {details['tries']} tries, attempting call to: {details['target'].__name__} with URL: {details['args'][0]}")

def on_giveup(details):
    logging.error(f"Max tries exceeded for {details['target'].__name__} with URL: {details['args'][0]}. Giving up.")

@app.route('/search/create', methods=['POST'])
def search_flights():
    payload = request.json  # Define payload here
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': SKYSCANNER_API_KEY
    }

    # Validate the payload and raise an InvalidQueryError if the payload is invalid
    if not payload or not payload.get('query'):
        raise InvalidQueryError()

    try: # Make request to Skyscanner API /create endpoint
        create_response = skyscanner_api_call(
            'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create',
            headers,
            payload
        )
        logging.info('Search request received with payload: %s', payload)

        create_response.raise_for_status() # Raise an exception for non-200 status code
    
    except requests.exceptions.HTTPError as err:
        logging.error(SKYSCANNER_API_ERROR_MSG, err)
        return handle_skyscanner_error(err)

    except InvalidQueryError as err:
        return jsonify({'error': str(err)}), err.code

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
        poll_response = skyscanner_api_call(poll_url, headers)
        logging.info('Polling request successful')
        poll_response.raise_for_status()

    except requests.exceptions.HTTPError as err:
        logging.error('Error from Skyscanner API: %s', err)
        return handle_skyscanner_error(err)

    # if successful continue
    return jsonify(poll_response.json()), 200

def handle_skyscanner_error(err):
    logging.error(SKYSCANNER_API_ERROR_MSG, err)  # Adds detailed error logging
    # Define retryable status codes as a list
    retryable_status_codes = [500, 502, 503, 429]

    if err.response.status_code in retryable_status_codes:
        raise err  # Retrying will be handled by @retry decorator
    elif err.response.status_code == 400:
        return jsonify({'error': 'There seems to be a problem with your search request. Please double-check your destination and dates.'}), 400
    elif err.response.status_code == 401:
        return jsonify({'error': 'Authentication failed. Please check your API key.'}), 401
    elif err.response.status_code == 403:
        return jsonify({'error': 'Forbidden: Access restricted. Try again later.'}), 403
    elif err.response.status_code == 404:
        return jsonify({'error': 'Resource Not Found: Flight information not found. Revise your search.'}), 404
    elif err.response.status_code == 429:
        return jsonify({'error': 'Too Many Requests: Slow down! Please try again in a few minutes.'}), 429
    else:  # For 500 and other potential errors
        return jsonify({'error': 'Internal Server Error:Oops! Something went wrong. Please try again later'}), 500  

if __name__ == '__main__':
    app.run(debug=True)