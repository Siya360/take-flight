from flask import Flask
from api.flights import search_flights, poll_flights  # Make sure poll_flights is imported

app = Flask(__name__)

@app.route('/')
def index():
    return "Welcome to TakeFlight 112! Sit back, relax, and enjoy the journey!"

# Maintain the existing rule for search
app.add_url_rule('/search/create', view_func=search_flights, methods=['POST'])

# Update the poll URL rule to include the session token in the path
app.add_url_rule('/search/poll/<session_token>', view_func=poll_flights, methods=['POST'])  # Updated poll URL rule

if __name__ == '__main__':
    app.run(debug=True)

