import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Search, MapPin, Users, ArrowRightLeft, ChevronDown, ChevronUp, Edit } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface SearchFormData {
  origin: string;
  destination: string;
  departureDate: Date | undefined;
  returnDate: Date | undefined;
  passengers: number;
  class: string;
  isRoundTrip: boolean;
}

interface FlightSearchProps {
  onSearch: (searchData: SearchFormData) => void;
  isLoading?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const FlightSearch = ({ onSearch, isLoading = false, isCollapsed = false, onToggleCollapse }: FlightSearchProps) => {
  const [searchData, setSearchData] = useState<SearchFormData>({
    origin: "",
    destination: "",
    departureDate: undefined,
    returnDate: undefined,
    passengers: 1,
    class: "economy",
    isRoundTrip: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchData);
  };

  const swapLocations = () => {
    setSearchData((prev) => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin,
    }));
  };

  if (isCollapsed) {
    // Collapsed view showing search summary
    return (
      <Card className="w-full shadow-card bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span className="font-medium">{searchData.origin || "Origin"} → {searchData.destination || "Destination"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{searchData.departureDate ? format(searchData.departureDate, "MMM dd") : "Departure"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>{searchData.passengers} passenger{searchData.passengers > 1 ? 's' : ''}</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleCollapse}
              className="flex items-center space-x-2 hover:bg-blue-100"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Search</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Expanded view with full form
  return (
    <Card className="w-full shadow-card">
      <CardContent className="p-6">
        {onToggleCollapse && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Search Flights</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="flex items-center space-x-1"
            >
              <ChevronUp className="h-4 w-4" />
              <span>Collapse</span>
            </Button>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Trip Type */}
          <div className="flex items-center space-x-2">
            <Switch
              id="round-trip"
              checked={searchData.isRoundTrip}
              onCheckedChange={(checked) =>
                setSearchData((prev) => ({ ...prev, isRoundTrip: checked }))
              }
            />
            <Label htmlFor="round-trip">Round Trip</Label>
          </div>

          {/* Origin and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            <div className="space-y-2">
              <Label htmlFor="origin">From</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="origin"
                  placeholder="Departure city or airport"
                  value={searchData.origin}
                  onChange={(e) =>
                    setSearchData((prev) => ({ ...prev, origin: e.target.value }))
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">To</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="destination"
                  placeholder="Destination city or airport"
                  value={searchData.destination}
                  onChange={(e) =>
                    setSearchData((prev) => ({ ...prev, destination: e.target.value }))
                  }
                  className="pl-10"
                  required
                />
              </div>
            </div>

            {/* Swap Button */}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 h-8 w-8 p-0 hidden md:flex"
              onClick={swapLocations}
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Departure Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !searchData.departureDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {searchData.departureDate ? (
                      format(searchData.departureDate, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={searchData.departureDate}
                    onSelect={(date) =>
                      setSearchData((prev) => ({ ...prev, departureDate: date }))
                    }
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {searchData.isRoundTrip && (
              <div className="space-y-2">
                <Label>Return Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !searchData.returnDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {searchData.returnDate ? (
                        format(searchData.returnDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={searchData.returnDate}
                      onSelect={(date) =>
                        setSearchData((prev) => ({ ...prev, returnDate: date }))
                      }
                      disabled={(date) =>
                        date < new Date() ||
                        (searchData.departureDate && date <= searchData.departureDate)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Passengers and Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passengers">Passengers</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Select
                  value={searchData.passengers.toString()}
                  onValueChange={(value) =>
                    setSearchData((prev) => ({ ...prev, passengers: parseInt(value) }))
                  }
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? "Passenger" : "Passengers"}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="class">Class</Label>
              <Select
                value={searchData.class}
                onValueChange={(value) =>
                  setSearchData((prev) => ({ ...prev, class: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="economy">Economy</SelectItem>
                  <SelectItem value="premium-economy">Premium Economy</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="first">First Class</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-sunset hover:opacity-90 h-12 text-lg font-semibold"
            disabled={isLoading}
          >
            <Search className="mr-2 h-5 w-5" />
            {isLoading ? "Searching..." : "Search Flights"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default FlightSearch;