import { useState } from "react";
import { Heart, MessageCircle, Settings, User, BookOpen, X, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";

// Sample profiles (will be replaced with real data from backend)
const sampleProfiles = [
  {
    name: "Alex",
    age: 28,
    role: "Submissive",
    distance: 2,
    matchPercentage: 95,
    verified: true,
    escrowProtected: true,
    bio: "Exploring the lifestyle with respect and care. Looking for genuine connections and meaningful experiences.",
    initials: "A"
  },
  {
    name: "Jordan",
    age: 32,
    role: "Switch",
    distance: 5,
    matchPercentage: 88,
    verified: false,
    escrowProtected: false,
    bio: "Experienced practitioner seeking meaningful connections. Values open communication and mutual respect.",
    initials: "J"
  },
  {
    name: "Sam",
    age: 26,
    role: "Submissive",
    distance: 8,
    matchPercentage: 91,
    verified: true,
    escrowProtected: true,
    bio: "New to the lifestyle but eager to learn with the right partner. Safety and consent are my priorities.",
    initials: "S"
  },
];

export default function Discover() {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentProfile = sampleProfiles[currentIndex];
  const hasMore = currentIndex < sampleProfiles.length - 1;

  const handleLike = () => {
    // Simulate a match (in real app, would check if mutual like)
    const isMatch = Math.random() > 0.7; // 30% chance of immediate match
    
    if (isMatch) {
      setLocation("/match-result");
    } else if (hasMore) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // No more profiles
      setCurrentIndex(0);
    }
  };

  const handlePass = () => {
    if (hasMore) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // No more profiles, restart
      setCurrentIndex(0);
    }
  };

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-light text-foreground mb-2">
            No More Profiles
          </h3>
          <p className="text-muted-foreground mb-4">
            Check back later for new matches
          </p>
          <Button
            onClick={() => setCurrentIndex(0)}
            className="rounded-full"
          >
            Start Over
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto h-screen w-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-background">
          <h2 className="text-2xl font-light text-foreground">Discover</h2>
          <button
            data-testid="button-settings"
            onClick={() => setLocation("/settings")}
            className="text-foreground/70 hover-elevate active-elevate-2 p-2 rounded-md"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Match Card */}
        <div className="flex-1 p-4 overflow-hidden">
          <Card className="h-full flex flex-col overflow-hidden" data-testid="match-card">
            {/* Profile Image Placeholder */}
            <div className="bg-gradient-to-br from-primary/60 to-pink-500/60 h-64 flex items-center justify-center relative rounded-t-xl">
              <Avatar className="w-32 h-32">
                <AvatarFallback className="text-5xl bg-primary/20">
                  {currentProfile.initials}
                </AvatarFallback>
              </Avatar>
              <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium" data-testid="text-match-percentage">
                {currentProfile.matchPercentage}%
              </div>
              {currentProfile.verified && (
                <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1" data-testid="badge-verified">
                  <Shield className="w-3 h-3" />
                  Verified Dom
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-2xl font-light mb-1 text-foreground" data-testid="text-match-name">
                {currentProfile.name}, {currentProfile.age}
              </h3>
              <p className="text-primary mb-2 font-medium" data-testid="text-match-role">
                {currentProfile.role}
              </p>
              <p className="text-muted-foreground text-sm mb-3 flex items-center gap-1" data-testid="text-match-distance">
                <MapPin className="w-4 h-4" />
                {currentProfile.distance} miles away
              </p>
              {currentProfile.escrowProtected && (
                <Card className="p-3 mb-3 bg-blue-500/10 border-blue-500/20" data-testid="card-escrow-info">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Escrow Protected
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    This Dom has active escrow for your safety
                  </p>
                </Card>
              )}
              <p className="text-foreground/80 leading-relaxed" data-testid="text-match-bio">
                {currentProfile.bio}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="p-6 flex justify-center gap-6 border-t border-border">
              <Button
                data-testid="button-pass"
                onClick={handlePass}
                size="icon"
                variant="secondary"
                className="rounded-full h-14 w-14"
              >
                <X className="w-6 h-6" />
              </Button>
              <Button
                data-testid="button-like"
                onClick={handleLike}
                size="icon"
                className="rounded-full h-14 w-14"
              >
                <Heart className="w-6 h-6" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-background p-4 flex justify-around border-t border-border">
          <button
            data-testid="nav-discover"
            className="text-primary p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <Heart className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-education"
            onClick={() => setLocation("/learn")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <BookOpen className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-messages"
            onClick={() => setLocation("/messages")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-profile"
            onClick={() => setLocation("/profile")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <User className="w-6 h-6" />
          </button>
        </nav>
      </div>
    </div>
  );
}
