import { useState, useEffect } from "react";
import { Heart, MessageCircle, Settings, User, BookOpen, X, MapPin, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Discover() {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { toast } = useToast();
  
  const userId = sessionStorage.getItem('userId');

  // Redirect to signup if no userId
  useEffect(() => {
    if (!userId) {
      setLocation('/signup');
    }
  }, [userId, setLocation]);

  // Prevent rendering if no userId (redirect in progress)
  if (!userId) {
    return null;
  }

  // Fetch potential matches only if userId exists
  const { data: potentialMatches, isLoading, isError } = useQuery<any[]>({
    queryKey: ['/api/matches/potential', userId],
    queryFn: async () => {
      const res = await fetch(`/api/matches/potential/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch matches');
      return await res.json();
    },
    enabled: Boolean(userId)
  });

  // Like mutation
  const likeMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      const res = await apiRequest('POST', '/api/matches/like', {
        userId,
        targetUserId
      });
      return await res.json();
    },
    onSuccess: (data) => {
      // Check if it's a mutual match
      if (data.mutualMatch) {
        setLocation("/match-result");
      } else {
        // Move to next profile
        if (hasMore) {
          setCurrentIndex(currentIndex + 1);
        } else {
          queryClient.invalidateQueries({ queryKey: ['/api/matches/potential', userId] });
          setCurrentIndex(0);
        }
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like user. Please try again."
      });
    }
  });

  // Pass mutation
  const passMutation = useMutation({
    mutationFn: async (targetUserId: string) => {
      const res = await apiRequest('POST', '/api/matches/pass', {
        userId,
        targetUserId
      });
      return await res.json();
    },
    onSuccess: () => {
      if (hasMore) {
        setCurrentIndex(currentIndex + 1);
      } else {
        queryClient.invalidateQueries({ queryKey: ['/api/matches/potential', userId] });
        setCurrentIndex(0);
      }
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to pass user. Please try again."
      });
    }
  });

  const profiles = potentialMatches || [];
  const currentProfile = profiles[currentIndex];
  const hasMore = currentIndex < profiles.length - 1;

  const handleLike = () => {
    if (currentProfile) {
      likeMutation.mutate(currentProfile.id);
    }
  };

  const handlePass = () => {
    if (currentProfile) {
      passMutation.mutate(currentProfile.id);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col overflow-hidden">
        <div className="max-w-md mx-auto w-full flex flex-col pb-20">
          {/* Header */}
          <div className="p-4 border-b border-border bg-background flex justify-between items-center">
            <h2 className="text-2xl font-light text-foreground">Discover</h2>
            <Settings className="w-6 h-6 text-foreground/70" />
          </div>

          {/* Floating Hearts Background */}
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <Heart className="absolute w-8 h-8 text-red-500/20 animate-float-1" style={{ left: '10%', top: '20%' }} />
            <Heart className="absolute w-6 h-6 text-red-500/15 animate-float-2" style={{ left: '80%', top: '15%' }} />
            <Heart className="absolute w-10 h-10 text-red-500/25 animate-float-3" style={{ left: '20%', top: '70%' }} />
            <Heart className="absolute w-7 h-7 text-red-500/20 animate-float-4" style={{ left: '70%', top: '60%' }} />
            <Heart className="absolute w-5 h-5 text-red-500/15 animate-float-5" style={{ left: '40%', top: '40%' }} />
            <Heart className="absolute w-9 h-9 text-red-500/20 animate-float-6" style={{ left: '85%', top: '75%' }} />
            <Heart className="absolute w-6 h-6 text-red-500/15 animate-float-1" style={{ left: '15%', top: '85%', animationDelay: '1s' }} />
            <Heart className="absolute w-8 h-8 text-red-500/20 animate-float-2" style={{ left: '60%', top: '25%', animationDelay: '1.5s' }} />
          </div>

          {/* Loading Content */}
          <div className="flex-1 flex items-center justify-center p-6 relative z-10">
            <div className="w-full max-w-sm space-y-4">
              {/* Animated Hearts */}
              <div className="flex justify-center mb-8 relative">
                <Heart className="w-12 h-12 text-red-500 animate-pulse absolute" style={{ animationDelay: '0ms' }} />
                <Heart className="w-8 h-8 text-red-500/60 animate-pulse absolute -left-8 top-2" style={{ animationDelay: '300ms' }} />
                <Heart className="w-6 h-6 text-red-500/40 animate-pulse absolute -right-8 top-3" style={{ animationDelay: '600ms' }} />
              </div>

              {/* Skeleton Profile Card */}
              <Card className="overflow-hidden">
                <div className="relative">
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" 
                       style={{ 
                         backgroundSize: '200% 100%',
                         animation: 'shimmer 2s infinite'
                       }} 
                  />
                  
                  {/* Card content skeleton */}
                  <div className="aspect-[3/4] bg-gradient-to-br from-muted/50 to-muted animate-pulse" />
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                    <div className="space-y-3">
                      <div className="h-8 bg-white/20 rounded-lg w-3/4 animate-pulse" />
                      <div className="h-4 bg-white/20 rounded-lg w-1/2 animate-pulse" style={{ animationDelay: '150ms' }} />
                      <div className="flex gap-2">
                        <div className="h-6 bg-white/20 rounded-full w-24 animate-pulse" style={{ animationDelay: '300ms' }} />
                        <div className="h-6 bg-white/20 rounded-full w-20 animate-pulse" style={{ animationDelay: '450ms' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Loading text with animated dots */}
              <div className="text-center">
                <p className="text-lg text-foreground font-light">
                  Finding your perfect match
                  <span className="inline-flex w-12">
                    <span className="animate-pulse" style={{ animationDelay: '0ms' }}>.</span>
                    <span className="animate-pulse" style={{ animationDelay: '200ms' }}>.</span>
                    <span className="animate-pulse" style={{ animationDelay: '400ms' }}>.</span>
                  </span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Analyzing compatibility scores
                </p>
              </div>

              {/* Action buttons skeleton */}
              <div className="flex justify-center gap-4 pt-4">
                <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
                <div className="w-20 h-20 rounded-full bg-red-500/20 animate-pulse" style={{ animationDelay: '200ms' }} />
                <div className="w-16 h-16 rounded-full bg-muted animate-pulse" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          </div>

          {/* Bottom Navigation */}
          <nav className="bg-background p-4 flex justify-around border-t border-border fixed bottom-0 left-0 right-0 max-w-md mx-auto">
            <div className="text-primary p-2">
              <Heart className="w-6 h-6" />
            </div>
            <div className="text-muted-foreground/30 p-2">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="text-muted-foreground/30 p-2">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="text-muted-foreground/30 p-2">
              <User className="w-6 h-6" />
            </div>
          </nav>
        </div>

        <style>{`
          @keyframes shimmer {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
          }
          
          @keyframes float-1 {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.2; }
            50% { transform: translateY(-30px) translateX(15px) rotate(10deg); opacity: 0.3; }
          }
          
          @keyframes float-2 {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.15; }
            50% { transform: translateY(-40px) translateX(-20px) rotate(-15deg); opacity: 0.25; }
          }
          
          @keyframes float-3 {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.25; }
            50% { transform: translateY(-50px) translateX(10px) rotate(20deg); opacity: 0.35; }
          }
          
          @keyframes float-4 {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.2; }
            50% { transform: translateY(-35px) translateX(-15px) rotate(-10deg); opacity: 0.3; }
          }
          
          @keyframes float-5 {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.15; }
            50% { transform: translateY(-45px) translateX(20px) rotate(15deg); opacity: 0.25; }
          }
          
          @keyframes float-6 {
            0%, 100% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.2; }
            50% { transform: translateY(-40px) translateX(-10px) rotate(-20deg); opacity: 0.3; }
          }
          
          .animate-float-1 { animation: float-1 4s ease-in-out infinite; }
          .animate-float-2 { animation: float-2 5s ease-in-out infinite; }
          .animate-float-3 { animation: float-3 6s ease-in-out infinite; }
          .animate-float-4 { animation: float-4 4.5s ease-in-out infinite; }
          .animate-float-5 { animation: float-5 5.5s ease-in-out infinite; }
          .animate-float-6 { animation: float-6 4.2s ease-in-out infinite; }
        `}</style>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <Heart className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-xl font-light text-foreground mb-2">
            Unable to Load Matches
          </h3>
          <p className="text-muted-foreground mb-4">
            Please complete your profile setup to see potential matches
          </p>
          <Button
            onClick={() => setLocation("/signup")}
            className="rounded-full"
          >
            Complete Profile
          </Button>
        </Card>
      </div>
    );
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <Heart className="w-16 h-16 text-red-500/30 mx-auto mb-4" />
          <h3 className="text-2xl font-light text-foreground mb-2">
            You're All Caught Up
          </h3>
          <p className="text-muted-foreground mb-6">
            You've reviewed all available matches. New profiles are added daily, so check back soon for more connections.
          </p>
          <div className="flex flex-col gap-3 items-center">
            <Button
              data-testid="button-view-profile"
              onClick={() => setLocation("/profile")}
              className="rounded-full bg-red-500 hover:bg-black text-white transition-colors px-12"
              size="lg"
            >
              My Profile
            </Button>
            <Button
              data-testid="button-start-over"
              onClick={() => setCurrentIndex(0)}
              variant="outline"
              className="rounded-full px-12"
              size="lg"
            >
              Review Again
            </Button>
          </div>
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
                  {currentProfile.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium" data-testid="text-match-percentage">
                {currentProfile.matchPercentage}%
              </div>
              {currentProfile.verified && (
                <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1" data-testid="badge-verified">
                  <Shield className="w-3 h-3" />
                  Verified {currentProfile.role}
                </div>
              )}
              
              {/* Floating Action Buttons */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-6">
                <Button
                  data-testid="button-pass"
                  onClick={handlePass}
                  disabled={passMutation.isPending || likeMutation.isPending}
                  size="icon"
                  variant="secondary"
                  className="rounded-full h-14 w-14 bg-background/90 backdrop-blur-sm border-2 border-border/50 shadow-lg hover:scale-110 transition-transform"
                >
                  <X className="w-6 h-6" />
                </Button>
                <Button
                  data-testid="button-like"
                  onClick={handleLike}
                  disabled={passMutation.isPending || likeMutation.isPending}
                  size="icon"
                  className="rounded-full h-14 w-14 bg-primary shadow-lg hover:scale-110 transition-transform"
                >
                  <Heart className="w-6 h-6" />
                </Button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 p-6 overflow-y-auto">
              <h3 className="text-2xl font-light mb-1 text-foreground" data-testid="text-match-name">
                {currentProfile.name}
              </h3>
              <p className="text-primary mb-2 font-medium" data-testid="text-match-role">
                {currentProfile.role}
              </p>
              <p className="text-muted-foreground text-sm mb-3 flex items-center gap-1" data-testid="text-match-distance">
                <MapPin className="w-4 h-4" />
                Location hidden for privacy
              </p>
              {currentProfile.escrowBalance > 0 && currentProfile.role === 'Dominant' && (
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
                {currentProfile.personalityType || 'Profile not yet complete'} • {currentProfile.relationshipStyle || 'Exploring'}
              </p>
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
