# poll_handler.py
import requests
from auth import get_skyscanner_headers

def poll_search(event, context):
    # Extract the session token from the event
    # The exact key depends on how you pass the session token to the Lambda function
    session_token = event['pathParameters']['sessionToken']

    # The URL for the Skyscanner /poll endpoint
    skyscanner_poll_url = f'https://partners.api.skyscanner.net/apiservices/v3/flights/live/search/poll/{session_token}'

    # Retrieve the necessary headers for authentication
    headers = get_skyscanner_headers()

    # Initialize the response outside the loop
    poll_response = None

    # Polling loop - in practice, you may implement this with a while loop and some delay
    while True:
        # Send the GET request to the Skyscanner API poll endpoint
        poll_response = requests.get(skyscanner_poll_url, headers=headers)

        # Check if the request was successful
        if poll_response.status_code == 200:
            # Parse the response to check the status
            response_data = poll_response.json()

            # Check if the status indicates the results are complete
            if response_data.get('status') == 'RESULT_STATUS_COMPLETE':
                # If results are complete, break the loop
                break
            # If results are not complete, you could wait and continue polling
            # For example, you could implement a time.sleep() here,
            # but be aware of Lambda's maximum execution time limit

        else:
            # If the request failed, log the error and return an error response
            error_message = poll_response.json().get('message', 'An error occurred while polling')
            print(f'Error polling search: {error_message}')
            return {
                'statusCode': poll_response.status_code,
                'body': {
                    'error': error_message
                }
            }

    # Return the final results
    return {
        'statusCode': 200,
        'body': poll_response.json()
    }

