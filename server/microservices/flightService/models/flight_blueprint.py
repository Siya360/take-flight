from .. import app  # Import app from the parent package

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
