# auth.py
import os

def get_skyscanner_headers():
    # Access the API key from an environment variable
    api_key = os.environ.get('SKYSCANNER_API_KEY')
    
    # Return the headers required for the API request
    headers = {
        'Content-Type': 'application/json',
        'x-api-key': api_key
    }
    
    return headers

