import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, Clock, Users, Wifi, Utensils } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  currency: string;
  seatsAvailable: number;
  aircraft: string;
  amenities: string[];
  stops: number;
}

interface FlightCardProps {
  flight: Flight;
  onSelect?: (flight: Flight) => void;
  onViewDetails?: (flight: Flight) => void;
}

const FlightCard = ({ flight, onSelect, onViewDetails }: FlightCardProps) => {
  const formatTime = (time: string) => {
    return new Date(time).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  // Remove the old formatPrice function - we'll use formatCurrency from lib

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />;
      case "meals":
        return <Utensils className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-elevation transition-all duration-300 hover:scale-[1.02] cursor-pointer group">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Plane className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{flight.airline}</h3>
              <p className="text-sm text-muted-foreground">{flight.flightNumber}</p>
            </div>
          </div>
          <Badge variant={flight.stops === 0 ? "default" : "secondary"}>
            {flight.stops === 0 ? "Direct" : `${flight.stops} Stop${flight.stops > 1 ? "s" : ""}`}
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* Departure */}
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {formatTime(flight.departureTime)}
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              {flight.origin}
            </p>
          </div>

          {/* Duration */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <div className="h-px bg-border flex-1"></div>
              <Clock className="h-4 w-4 text-muted-foreground mx-2" />
              <div className="h-px bg-border flex-1"></div>
            </div>
            <p className="text-sm text-muted-foreground">{flight.duration}</p>
          </div>

          {/* Arrival */}
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {formatTime(flight.arrivalTime)}
            </p>
            <p className="text-sm text-muted-foreground font-medium">
              {flight.destination}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Users className="h-4 w-4" />
              <span className="text-sm">{flight.seatsAvailable} seats left</span>
            </div>
            <div className="flex items-center space-x-2">
              {flight.amenities.map((amenity, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-1 text-muted-foreground"
                  title={amenity}
                >
                  {getAmenityIcon(amenity)}
                </div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(flight.price, flight.currency)}
            </p>
            <p className="text-sm text-muted-foreground">per person</p>
          </div>
        </div>

        <div className="flex items-center justify-between space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onViewDetails?.(flight)}
          >
            View Details
          </Button>
          <Button
            className="flex-1 bg-gradient-sunset hover:opacity-90"
            onClick={() => onSelect?.(flight)}
          >
            Select Flight
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightCard;