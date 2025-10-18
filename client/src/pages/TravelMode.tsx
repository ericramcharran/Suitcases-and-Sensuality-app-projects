import { ChevronLeft, MapPin, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const popularCities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Miami, FL",
  "San Francisco, CA",
  "Las Vegas, NV",
  "Seattle, WA",
  "Austin, TX",
  "Boston, MA",
  "Denver, CO",
  "Atlanta, GA",
  "San Diego, CA"
];

export default function TravelMode() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [customLocation, setCustomLocation] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/profile");
    }
  }, [setLocation]);

  const handleSelectCity = (city: string) => {
    setSelectedCity(city);
    setCustomLocation("");
  };

  const handleSaveLocation = () => {
    const locationToSave = customLocation || selectedCity;
    
    if (!locationToSave) {
      toast({
        variant: "destructive",
        title: "No location selected",
        description: "Please select a city or enter a custom location"
      });
      return;
    }

    // Save to sessionStorage (in production, this would save to the backend)
    sessionStorage.setItem('travelLocation', locationToSave);
    sessionStorage.setItem('isTraveling', 'true');

    toast({
      title: "Travel mode activated",
      description: `You'll now see matches near ${locationToSave}`
    });

    setLocation("/profile");
  };

  const handleDeactivateTravel = () => {
    sessionStorage.removeItem('travelLocation');
    sessionStorage.removeItem('isTraveling');

    toast({
      title: "Travel mode deactivated",
      description: "You'll now see matches in your home location"
    });

    setLocation("/profile");
  };

  const currentTravelLocation = sessionStorage.getItem('travelLocation');
  const isTraveling = sessionStorage.getItem('isTraveling') === 'true';

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-6">
      <button
        data-testid="button-back"
        onClick={handleBack}
        className="mb-4 sm:mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-2 rounded-md min-h-[44px]"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-light mb-2 text-foreground">
            Travel Mode
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            Change your location to discover matches in other cities
          </p>
        </div>

        {/* Current Status */}
        {isTraveling && currentTravelLocation && (
          <Card className="p-4 mb-6 bg-primary/5 border-primary/20">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-1">Currently Traveling</h3>
                <p className="text-sm text-muted-foreground">
                  Showing matches near <span className="font-medium text-foreground">{currentTravelLocation}</span>
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Custom Location Input */}
        <Card className="p-4 sm:p-6 mb-4">
          <Label htmlFor="custom-location" className="text-base font-medium mb-3 block">
            Enter Your Travel Destination
          </Label>
          <div className="space-y-3">
            <Input
              id="custom-location"
              data-testid="input-custom-location"
              placeholder="e.g., Paris, France or Tokyo, Japan"
              value={customLocation}
              onChange={(e) => {
                setCustomLocation(e.target.value);
                setSelectedCity("");
              }}
              className="text-base"
            />
            <p className="text-xs text-muted-foreground">
              Enter any city name and country for international travel
            </p>
          </div>
        </Card>

        {/* Popular Cities */}
        <Card className="p-4 sm:p-6 mb-6">
          <h3 className="font-medium text-foreground mb-4">Popular U.S. Cities</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {popularCities.map((city) => (
              <Button
                key={city}
                data-testid={`button-city-${city}`}
                onClick={() => handleSelectCity(city)}
                variant={selectedCity === city ? "default" : "outline"}
                className="rounded-full text-sm min-h-[44px]"
              >
                {city}
              </Button>
            ))}
          </div>
        </Card>

        {/* Privacy Note */}
        <Card className="p-4 mb-6 bg-muted border-border">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground mb-1 text-sm">Privacy Protected</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your exact location is never shared. Other users will only see approximate distance from your selected city. You can change or deactivate travel mode anytime.
              </p>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button
            data-testid="button-save-location"
            onClick={handleSaveLocation}
            disabled={!customLocation && !selectedCity}
            className="w-full rounded-full bg-primary hover:bg-primary/90 text-white min-h-[48px]"
            size="lg"
          >
            Activate Travel Mode
          </Button>
          
          {isTraveling && (
            <Button
              data-testid="button-deactivate-travel"
              onClick={handleDeactivateTravel}
              variant="outline"
              className="w-full rounded-full min-h-[48px]"
              size="lg"
            >
              Deactivate Travel Mode
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
