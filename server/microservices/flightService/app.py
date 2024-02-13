# server/microservices/flightService/app.py
# Import the Flask framework
from flask import Flask
# Import the flights blueprint from the api module
from api.flights import flights_blueprint

# Initialize the Flask application
app = Flask(__name__)

# Register the flights blueprint with the Flask application
# Prefix the blueprint URL with '/api/flights'
app.register_blueprint(flights_blueprint, url_prefix='/api/flights')

# Define a route for the root URL ('/')
# This route returns a welcome message to the user
@app.route('/')
def index():
    return 'Welcome to TakeFlight 101!'

# Run the Flask application if this script is executed directly
if __name__ == '__main__':
    app.run(debug=True)  # Run the app in debug mode for easier development
