from flask import Flask, request, jsonify
import requests
import os
from werkzeug.exceptions import HTTPException

app = Flask(__name__)

# Retrieve API key from environment variables
SKYSCANNER_API_KEY = os.getenv('SKYSCANNER_API_KEY')

class InvalidQueryError(HTTPException):
    code = 400
    description = 'Invalid query parameters'

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

    # Make request to Skyscanner API /create endpoint
    create_response = requests.post(
        'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create',
        json=payload,
        headers=headers
    )

    # Directly return the status code and response from the Skyscanner API
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

    # Make the polling request
    poll_response = requests.post(poll_url, headers=headers)

    if poll_response.status_code == 200:
        return jsonify(poll_response.json()), 200
    else:
        return jsonify({'error': 'Failed to poll results.', 'status_code': poll_response.status_code}), poll_response.status_code

if __name__ == '__main__':
    app.run(debug=True)
