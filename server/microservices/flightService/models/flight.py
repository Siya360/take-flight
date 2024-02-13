# This is models/flight.py

# Import SQLAlchemy
from flask_sqlalchemy import SQLAlchemy

# Initialize SQLAlchemy
db = SQLAlchemy()

# Define the Flight class
class Flight(db.Model):
    # Define columns for the Flight table
    id = db.Column(db.Integer, primary_key=True)  # Primary key column
    airline = db.Column(db.String(255), nullable=False)  # Column for airline name
    departure_time = db.Column(db.DateTime, nullable=False)  # Column for departure time
    arrival_time = db.Column(db.DateTime, nullable=False)  # Column for arrival time
    price = db.Column(db.Float, nullable=False)  # Column for price

    # Constructor method to initialize a Flight object
    def __init__(self, airline, departure_time, arrival_time, price):
        self.airline = airline
        self.departure_time = departure_time
        self.arrival_time = arrival_time
        self.price = price

    # Method to serialize a Flight object into a dictionary
    def serialize(self):
        return {
            'id': self.id,
            'airline': self.airline,
            'departureTime': self.departure_time,
            'arrivalTime': self.arrival_time,
            'price': self.price
        }

