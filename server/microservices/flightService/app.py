from flask import Flask
from api.flights import flights_blueprint

app = Flask(__name__)
app.register_blueprint(flights_blueprint, url_prefix='/api/flights')

@app.route('/')
def index():
    return 'Welcome to TakeFlight 101!'

if __name__ == '__main__':
    app.run(debug=True)
