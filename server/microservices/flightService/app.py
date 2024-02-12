from flask import Flask
from api.flights import flights_blueprint

app = Flask(__name__)
app.register_blueprint(flights_blueprint, url_prefix='/api/flights')

@app.route('/')
def index():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(debug=True)
