# This is models/flight.py

class Flight:
    def __init__(self, id, airline, departure_time, arrival_time, price):
        self.id = id
        self.airline = airline
        self.departure_time = departure_time
        self.arrival_time = arrival_time
        self.price = price

    def serialize(self):
        return {
            'id': self.id,
            'airline': self.airline,
            'departureTime': self.departure_time,
            'arrivalTime': self.arrival_time,
            'price': self.price
        }
