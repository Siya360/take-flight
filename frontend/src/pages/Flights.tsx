import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import FlightSearch from "@/components/flight/FlightSearch";
import FlightCard from "@/components/flight/FlightCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Filter, SlidersHorizontal, Plane } from "lucide-react";

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

interface SearchFormData {
  origin: string;
  destination: string;
  departureDate: Date | undefined;
  returnDate: Date | undefined;
  passengers: number;
  class: string;
  isRoundTrip: boolean;
}

const Flights = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedAirlines, setSelectedAirlines] = useState<string[]>([]);
  const [stopsFilter, setStopsFilter] = useState("all");
  const [sortBy, setSortBy] = useState("price");

  const mockFlights: Flight[] = [
    {
      id: "1",
      airline: "SkyLine Airways",
      flightNumber: "SL123",
      origin: "NYC",
      destination: "LAX",
      departureTime: "2024-03-15T08:00:00Z",
      arrivalTime: "2024-03-15T11:30:00Z",
      duration: "5h 30m",
      price: 299,
      currency: "USD",
      seatsAvailable: 12,
      aircraft: "Boeing 737",
      amenities: ["wifi", "meals"],
      stops: 0,
    },
    {
      id: "2",
      airline: "AeroFlex",
      flightNumber: "AF456",
      origin: "NYC",
      destination: "LAX",
      departureTime: "2024-03-15T14:15:00Z",
      arrivalTime: "2024-03-15T17:45:00Z",
      duration: "5h 30m",
      price: 349,
      currency: "USD",
      seatsAvailable: 8,
      aircraft: "Airbus A320",
      amenities: ["wifi"],
      stops: 0,
    },
    {
      id: "3",
      airline: "Pacific Airlines",
      flightNumber: "PA789",
      origin: "NYC",
      destination: "LAX",
      departureTime: "2024-03-15T12:30:00Z",
      arrivalTime: "2024-03-15T18:15:00Z",
      duration: "7h 45m",
      price: 199,
      currency: "USD",
      seatsAvailable: 24,
      aircraft: "Boeing 767",
      amenities: ["meals"],
      stops: 1,
    },
  ];

  useEffect(() => {
    // Simulate initial load
    setFlights(mockFlights);
    setFilteredFlights(mockFlights);
  }, []);

  const handleSearch = async (searchData: SearchFormData) => {
    setIsLoading(true);
    // Simulate API call to /api/flights with search parameters
    setTimeout(() => {
      setFlights(mockFlights);
      setFilteredFlights(mockFlights);
      setIsLoading(false);
    }, 2000);
  };

  const applyFilters = () => {
    let filtered = [...flights];

    // Price filter
    filtered = filtered.filter(
      (flight) => flight.price >= priceRange[0] && flight.price <= priceRange[1]
    );

    // Airline filter
    if (selectedAirlines.length > 0) {
      filtered = filtered.filter((flight) =>
        selectedAirlines.includes(flight.airline)
      );
    }

    // Stops filter
    if (stopsFilter !== "all") {
      const stops = stopsFilter === "direct" ? 0 : parseInt(stopsFilter);
      filtered = filtered.filter((flight) => flight.stops === stops);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "duration":
          return a.duration.localeCompare(b.duration);
        case "departure":
          return new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime();
        default:
          return 0;
      }
    });

    setFilteredFlights(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [flights, priceRange, selectedAirlines, stopsFilter, sortBy]);

  const airlines = Array.from(new Set(flights.map((flight) => flight.airline)));

  return (
    <Layout>
      <div className="bg-gradient-sky text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-center">Find Your Perfect Flight</h1>
          <div className="max-w-4xl mx-auto">
            <FlightSearch onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80">
            <Card className="sticky top-24">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <Filter className="h-5 w-5" />
                    <span>Filters</span>
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                {/* Sort */}
                <div className="space-y-2">
                  <Label>Sort by</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price">Price (Low to High)</SelectItem>
                      <SelectItem value="duration">Duration</SelectItem>
                      <SelectItem value="departure">Departure Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <Label>Price Range</Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>

                {/* Stops */}
                <div className="space-y-2">
                  <Label>Stops</Label>
                  <Select value={stopsFilter} onValueChange={setStopsFilter}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All flights</SelectItem>
                      <SelectItem value="direct">Direct flights only</SelectItem>
                      <SelectItem value="1">1 stop</SelectItem>
                      <SelectItem value="2">2+ stops</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Airlines */}
                <div className="space-y-3">
                  <Label>Airlines</Label>
                  <div className="space-y-2">
                    {airlines.map((airline) => (
                      <div key={airline} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={airline}
                          checked={selectedAirlines.includes(airline)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAirlines([...selectedAirlines, airline]);
                            } else {
                              setSelectedAirlines(
                                selectedAirlines.filter((a) => a !== airline)
                              );
                            }
                          }}
                          className="rounded"
                        />
                        <label
                          htmlFor={airline}
                          className="text-sm font-medium cursor-pointer"
                        >
                          {airline}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Results */}
          <main className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Search Results</h2>
                <p className="text-muted-foreground">
                  {filteredFlights.length} flights found
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">{filteredFlights.length} results</Badge>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin mx-auto mb-4">
                  <Plane className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground">Searching for flights...</p>
              </div>
            ) : filteredFlights.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <CardTitle className="mb-2">No flights found</CardTitle>
                  <CardDescription>
                    Try adjusting your search criteria or filters
                  </CardDescription>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredFlights.map((flight) => (
                  <FlightCard
                    key={flight.id}
                    flight={flight}
                    onSelect={(flight) => {
                      console.log("Selected flight:", flight);
                      // Navigate to booking page
                    }}
                    onViewDetails={(flight) => {
                      console.log("View details:", flight);
                      // Open flight details modal
                    }}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Flights;