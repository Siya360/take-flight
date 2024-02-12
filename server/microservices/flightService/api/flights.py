from flask import Blueprint, request, jsonify
import requests
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
api_key = os.getenv('SKYSCANNER_API_KEY')

# Create a Flask Blueprint
flights_blueprint = Blueprint('flights', __name__)

@flights_blueprint.route('/search/create', methods=['POST'])
def create_search():
    # Extract the search parameters from the request
    search_params = request.get_json()

    # Construct the URL for the Skyscanner /create endpoint
    create_url = 'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create'

    # Construct the headers including the API key
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': api_key
    }

    try:
        # Initiate the flight search by sending a POST request to the /create endpoint
        create_response = requests.post(create_url, json=search_params, headers=headers)
        create_response.raise_for_status()

        # Extract the session token from the create response
        session_token = create_response.json().get('sessionToken')

        # Return the session token so it can be used to poll for results
        return jsonify({'sessionToken': session_token}), 201

    except requests.RequestException as e:
        # Handle any errors that occur during the request
        return jsonify({'error': str(e)}), 500

@flights_blueprint.route('/search/poll/<session_token>', methods=['GET'])
def poll_search(session_token):
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

        # Return the flight data
        return jsonify(flights_data), 200

    except requests.RequestException as e:
        # Handle any errors that occur during the request
        return jsonify({'error': str(e)}), 500
