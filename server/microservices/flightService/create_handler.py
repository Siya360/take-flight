# create_handler.py
import requests
from auth import get_skyscanner_headers

# Assume we are using the requests library to make HTTP requests

def create_search(event, context):
    # The URL for the Skyscanner /create endpoint
    skyscanner_create_url = 'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/create'
    
    # Retrieve the necessary headers for authentication
    headers = get_skyscanner_headers()
    
    # Assume the event['body'] contains the payload as a JSON string
    # You may need to parse it if it's a string, or adjust depending on how the event is structured
    payload = event.get('body')
    
    # Send the POST request to the Skyscanner API
    response = requests.post(skyscanner_create_url, headers=headers, json=payload)
    
    # Check if the request was successful
    if response.status_code == 201:
        # If successful, extract the session token and return it
        session_token = response.json().get('sessionToken')
        return {
            'statusCode': 201,
            'body': {
                'sessionToken': session_token
            }
        }
    else:
        # If the request failed, log the error and return an error response
        error_message = response.json().get('message', 'An error occurred')
        print(f'Error creating search: {error_message}')
        return {
            'statusCode': response.status_code,
            'body': {
                'error': error_message
            }
        }

