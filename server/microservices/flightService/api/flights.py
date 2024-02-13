# server/microservices/flightService/api/flights.py

# Import the required libraries
import re
from flask import Blueprint, request, jsonify
import requests
from dotenv import load_dotenv
from requests.exceptions import HTTPError, ConnectionError, Timeout
import os
import logging

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

# Create a Flask Blueprint
flights_blueprint = Blueprint('flights', __name__)

# API Key Configuration
api_key = os.getenv('SKYSCANNER_API_KEY')

# Define a function to validate the 'market' field in the search parameters
def validate_market(search_params):
    # If 'market' is not 'US' or 'ZA', return an error
    if 'market' in search_params and search_params['market'] not in ['US', 'ZA']:
        return ["Invalid market value."]
    return []

# Define a function to validate the 'locale' field in the search parameters
def validate_locale(search_params):
    # If 'locale' is missing or not a string, return an error
    if 'locale' not in search_params or not isinstance(search_params['locale'], str):
        return ["Missing or invalid 'locale'. 'locale' must be a string."]
    return []

# Define a function to validate the 'currency' field in the search parameters
def validate_currency(search_params):
    # If 'currency' is missing or not a string, return an error
    if 'currency' not in search_params or not isinstance(search_params['currency'], str):
        return ["Missing or invalid 'currency'. 'currency' must be a string."]
    return []

# Define a function to validate the 'queryLegs' field in the search parameters
def validate_query_legs(search_params):
    errors = []
    # If 'queryLegs' is present, validate each 'leg'
    if 'queryLegs' in search_params:
        for leg in search_params['queryLegs']:
            # If 'origin' or 'destination' is missing in a 'leg', return an error
            if 'origin' not in leg or 'destination' not in leg:
                errors.append("Each queryLeg must include origin and destination.")
            else:
                # If 'origin' or 'destination' does not match the IATA code format, return an error
                if not re.match(r"^[A-Z]{2,3}$", leg['origin']) or not re.match(r"^[A-Z]{2,3}$", leg['destination']):
                    errors.append("Invalid IATA code in queryLegs.")
    return errors

# Define a function to validate the 'adults' field in the search parameters
def validate_adults(search_params):
    # If 'adults' is missing, not an integer, or not positive, return an error
    if 'adults' not in search_params or not isinstance(search_params['adults'], int) or search_params['adults'] <= 0:
        return ["Missing or invalid 'adults'. 'adults' must be a positive integer."]
    return []

# Define a function to validate all search parameters
def validate_search_params(search_params):
    errors = []
    # List of all validators
    validators = [validate_market, validate_locale, validate_currency, validate_query_legs, validate_adults]
    
    # Run each validator on the search parameters and collect all errors
    for validator in validators:
        errors.extend(validator(search_params))
    
    # Return all collected errors
    return errors

# The endpoint uses the validation function
@flights_blueprint.route('/search/create', methods=['POST'])
def create_search():
    search_params = request.get_json()
    logger.info(f"Received search request with parameters: {search_params}")
    
    # Validate search parameters
    validation_errors = validate_search_params(search_params)
    if validation_errors:
        return jsonify({'error': 'Validation failed', 'details': validation_errors}), 400
    
    # Construct the headers including the API key
    headers = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'x-api-key': api_key
    }

    # Construct the URL for the Skyscanner /create endpoint
    api_url = 'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create'

    try:
        # Initiate the flight search by sending a POST request to the /create endpoint
        create_response = requests.post(api_url, json=search_params, headers=headers)
        
        if create_response.status_code == 201:
            # Extract the session token from the create response
            session_token = create_response.json().get('sessionToken')
            logger.info(f"Flight search initiated with session token: {session_token}")
            return jsonify({'sessionToken': session_token}), 201
        else:
            logger.error(f"Failed to initiate flight search: {create_response.json()}")
            # Handle errors based on different statuses
            return jsonify({'error': 'Failed to initiate flight search', 'details': create_response.json()}), create_response.status_code

    except requests.RequestException as e:
        logger.exception('Error occurred while initiating flight search', e)
        # Handle any errors that occur during the request
        return jsonify({'error': str(e)}), 500

@flights_blueprint.route('/search/poll/<session_token>', methods=['GET'])
def poll_search(session_token):
    logger.info(f"Polling for flight search results with session token: {session_token}")
    # Construct the URL for the Skyscanner /poll endpoint including the session token
    poll_url = f'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/poll/{session_token}'

    # Construct the headers including the API key
    headers = {
        'x-api-key': api_key
    }

    try:
        # Poll for the full list of flight search results
        poll_response = requests.get(poll_url, headers=headers)
        poll_response.raise_for_status()

        # Extract the flight data from the poll response
        flights_data = poll_response.json()
        
        # Log the flight data
        logger.info(f"Received flight search results: {flights_data}")
        # Return the flight data
        return jsonify(flights_data), 200

    except requests.RequestException as e:
        logger.exception('Error occurred while polling for flight search results', e)
        # Handle any errors that occur during the request
        return jsonify({'error': str(e)}), 500
    
# Assuming poll_response contains the raw data from Skyscanner
    raw_data = poll_response.json()

    # Transforming the raw data to match the front-end requirements
    transformed_flights = []
    for raw_flight in raw_data.get('flights', []):
        transformed_flight = {
            'id': raw_flight.get('id'),
            'airline': raw_flight.get('airline', {}).get('name'),  # Assuming the airline name is nested
            'departureTime': raw_flight.get('departureTime'),
            'arrivalTime': raw_flight.get('arrivalTime'),
            'duration': raw_flight.get('duration'),
            'price': raw_flight.get('price')
        }
        # Optionally, format the price, date, and duration here
        transformed_flights.append(transformed_flight)

    # Return the transformed data
    return jsonify(transformed_flights), 200
