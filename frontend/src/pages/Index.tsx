import { useState } from "react";
import Layout from "@/components/layout/Layout";
import FlightSearch from "@/components/flight/FlightSearch";
import FlightCard from "@/components/flight/FlightCard";
import { Button } from "@/components/ui/button";
import { Plane, Globe, Shield, Headphones } from "lucide-react";

interface SearchFormData {
  origin: string;
  destination: string;
  departureDate: Date | undefined;
  returnDate: Date | undefined;
  passengers: number;
  class: string;
  isRoundTrip: boolean;
}

const Index = () => {
  console.log("Index component is rendering");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const handleSearch = async (searchData: SearchFormData) => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      const mockFlights = [
        {
          id: "1",
          airline: "SkyLine Airways",
          flightNumber: "SL123",
          origin: searchData.origin || "NYC",
          destination: searchData.destination || "LAX",
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
          origin: searchData.origin || "NYC",
          destination: searchData.destination || "LAX",
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
      ];
      setSearchResults(mockFlights);
      setIsSearching(false);
    }, 2000);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-hero text-white py-20 lg:py-32">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 animate-fade-in">
              Your Journey Begins Here
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Discover the world with our intelligent flight booking platform. 
              Powered by AI, designed for seamless travel experiences.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <FlightSearch onSearch={handleSearch} isLoading={isSearching} />
          </div>
        </div>
      </section>

      {/* Search Results */}
      {searchResults.length > 0 && (
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Available Flights
            </h2>
            <div className="grid gap-6 max-w-4xl mx-auto">
              {searchResults.map((flight) => (
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
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Choose Take Flight?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience the future of travel booking with our advanced AI-powered platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-sky rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Search</h3>
              <p className="text-muted-foreground">
                AI-powered flight discovery that finds the best options for your needs
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-sky rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Global Coverage</h3>
              <p className="text-muted-foreground">
                Access flights from hundreds of airlines across the world
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-sky rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Booking</h3>
              <p className="text-muted-foreground">
                Enterprise-grade security for your personal and payment information
              </p>
            </div>
            
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-sky rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">
                Round-the-clock assistance from our AI assistant and support team
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-sky text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Flight?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust us for their journey planning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-primary">
              Explore Destinations
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Download Mobile App
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
