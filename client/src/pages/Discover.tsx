import { useState, useEffect } from "react";
import { Heart, MessageCircle, Settings, User, BookOpen, X, MapPin, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import HeartTransition from "@/components/HeartTransition";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { motion, useMotionValue, useTransform, PanInfo } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";

export default function Discover() {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [includeReviewed, setIncludeReviewed] = useState(false);
  const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);
  const { toast } = useToast();
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false });
  
  const userId = sessionStorage.getItem('userId');

  // Both buttons locked in fixed positions
  const [isDraggingButtons] = useState(false);
  
  // X button - locked position from localStorage
  const savedPassPosition = (() => {
    const saved = localStorage.getItem('passButtonPosition');
    return saved ? JSON.parse(saved) : { x: 30, y: 30 };
  })();
  
  // Heart button - locked position (RESET TO DEFAULT)
  const savedLikePosition = (() => {
    // Clear any off-screen positioning and reset to center
    localStorage.removeItem('likeButtonPosition');
    return { x: 0, y: 0 };
  })();

  // Profile card position - developer control
  const [profileCardPosition, setProfileCardPosition] = useState(() => {
    const saved = localStorage.getItem('profileCardPosition');
    return saved ? JSON.parse(saved) : { x: 0, y: 0 };
  });

  const [isDraggingProfileCard, setIsDraggingProfileCard] = useState(false);

  // Ensure beating heart shows for at least 10 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingTimePassed(true);
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, []);

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
    queryKey: ['/api/matches/potential', userId, includeReviewed],
    queryFn: async () => {
      const url = includeReviewed 
        ? `/api/matches/potential/${userId}?includeReviewed=true`
        : `/api/matches/potential/${userId}`;
      const res = await fetch(url);
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
          // Only invalidate and reset if not in review mode
          if (!includeReviewed) {
            queryClient.invalidateQueries({ queryKey: ['/api/matches/potential', userId] });
          }
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
        // Only invalidate and reset if not in review mode
        if (!includeReviewed) {
          queryClient.invalidateQueries({ queryKey: ['/api/matches/potential', userId] });
        }
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

  // Reset index when includeReviewed changes
  useEffect(() => {
    if (includeReviewed && profiles.length > 0) {
      setCurrentIndex(0);
    }
  }, [includeReviewed, profiles.length]);

  // Reset image index when profile changes
  useEffect(() => {
    setCurrentImageIndex(0);
    if (emblaApi) {
      emblaApi.scrollTo(0);
    }
  }, [currentIndex, emblaApi]);

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

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const swipeThreshold = 100;
    
    if (info.offset.x > swipeThreshold) {
      // Swiped right = like
      handleLike();
    } else if (info.offset.x < -swipeThreshold) {
      // Swiped left = pass
      handlePass();
    }
  };

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentImageIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on('select', onSelect);
    onSelect();

    return () => {
      emblaApi.off('select', onSelect);
    };
  }, [emblaApi]);

  // Show beating heart for at least 10 seconds
  if (isLoading || !minLoadingTimePassed) {
    return <HeartTransition duration={10000} onComplete={() => setMinLoadingTimePassed(true)} />;
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

  // Show loading state when switching to review mode
  if (!currentProfile && includeReviewed && isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-8 text-center max-w-md">
          <Heart className="w-16 h-16 text-red-500 animate-pulse mx-auto mb-4" />
          <h3 className="text-2xl font-light text-foreground mb-2">
            Loading Profiles...
          </h3>
          <p className="text-muted-foreground mb-6">
            Getting all matches ready for review
          </p>
        </Card>
      </div>
    );
  }

  // Show "All Caught Up" if no profiles and not in review mode
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
              onClick={async () => {
                setIncludeReviewed(true);
                setCurrentIndex(0);
                await queryClient.refetchQueries({ queryKey: ['/api/matches/potential', userId, true] });
              }}
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
        <div className="p-3 sm:p-4 border-b border-border flex justify-between items-center bg-background">
          <h2 className="text-xl sm:text-2xl font-light text-foreground">Discover</h2>
          <div className="flex gap-2">
            <button
              data-testid="button-settings"
              onClick={() => setLocation("/settings")}
              className="text-foreground/70 hover-elevate active-elevate-2 p-2 rounded-md min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Settings className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Match Card */}
        <div className="flex-1 p-3 sm:p-4 overflow-hidden relative">
          {/* Developer positioning wrapper */}
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            onDragStart={() => setIsDraggingProfileCard(true)}
            onDrag={(e, info) => {
              setProfileCardPosition({ x: info.offset.x, y: info.offset.y });
            }}
            onDragEnd={() => {
              setIsDraggingProfileCard(false);
              localStorage.setItem('profileCardPosition', JSON.stringify(profileCardPosition));
              toast({
                title: "Profile Position Saved",
                description: `Card positioned at (${Math.round(profileCardPosition.x)}, ${Math.round(profileCardPosition.y)})`,
              });
            }}
            style={{
              x: profileCardPosition.x,
              y: profileCardPosition.y,
              cursor: isDraggingProfileCard ? 'grabbing' : 'grab'
            }}
            className="h-full"
          >
            {/* Swipe-to-dismiss wrapper */}
            <motion.div
              style={{ x, rotate, opacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="h-full"
            >
            <Card className="h-full flex flex-col" data-testid="match-card">
              {/* Profile Image Carousel - 30% larger than before */}
              <div className="relative bg-muted rounded-t-xl flex-[1.3] overflow-hidden">
                {currentProfile.profileImages && currentProfile.profileImages.length > 0 ? (
                  <>
                    {/* Carousel */}
                    <div className="overflow-hidden h-full" ref={emblaRef}>
                      <div className="flex h-full">
                        {currentProfile.profileImages.map((imageUrl: string, idx: number) => (
                          <div key={idx} className="flex-[0_0_100%] min-w-0 relative h-full">
                            <img
                              src={imageUrl}
                              alt={`${currentProfile.name} ${idx + 1}`}
                              className="w-full h-full object-cover"
                              data-testid={`image-profile-${idx}`}
                            />
                            {/* Gradient overlay for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation Arrows */}
                    {currentProfile.profileImages.length > 1 && (
                      <>
                        {currentImageIndex > 0 && (
                          <button
                            onClick={scrollPrev}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                            data-testid="button-prev-image"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        )}
                        {currentImageIndex < currentProfile.profileImages.length - 1 && (
                          <button
                            onClick={scrollNext}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors z-10"
                            data-testid="button-next-image"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        )}

                        {/* Image Indicators */}
                        <div className="absolute top-4 left-0 right-0 flex justify-center gap-1 z-10">
                          {currentProfile.profileImages.map((_: any, idx: number) => (
                            <div
                              key={idx}
                              className={`h-1 rounded-full transition-all ${
                                idx === currentImageIndex
                                  ? 'w-8 bg-white'
                                  : 'w-1 bg-white/50'
                              }`}
                              data-testid={`indicator-${idx}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="bg-gradient-to-br from-primary/60 to-pink-500/60 h-full flex items-center justify-center">
                    <Avatar className="w-32 h-32">
                      <AvatarFallback className="text-5xl bg-primary/20">
                        {currentProfile.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}

                {/* Match Percentage Badge */}
                <div className="absolute top-4 right-4 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-medium z-10" data-testid="text-match-percentage">
                  {currentProfile.matchPercentage}%
                </div>

                {/* Verified Badge */}
                {currentProfile.verified && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 z-10" data-testid="badge-verified">
                    <Shield className="w-3 h-3" />
                    Verified {currentProfile.role}
                  </div>
                )}
                
                {/* Swipe Hint Overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: x.get() < -50 ? 1 : 0 }}
                    className="bg-red-500/90 text-white px-4 py-2 rounded-lg font-bold text-lg -rotate-12"
                  >
                    PASS
                  </motion.div>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center pointer-events-none">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: x.get() > 50 ? 1 : 0 }}
                    className="bg-green-500/90 text-white px-4 py-2 rounded-lg font-bold text-lg rotate-12"
                  >
                    LIKE
                  </motion.div>
                </div>

                {/* Floating Action Buttons - LOCKED IN POSITION */}
                {/* Pass Button - WHITE X - Uses saved position */}
                <div
                  style={{
                    position: 'absolute',
                    left: `${savedPassPosition.x}px`,
                    bottom: `${savedPassPosition.y}px`,
                    zIndex: 999,
                    filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.4)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3))'
                  }}
                >
                  <Button
                    data-testid="button-pass"
                    onClick={handlePass}
                    disabled={passMutation.isPending || likeMutation.isPending}
                    size="icon"
                    variant="secondary"
                    className="rounded-full h-12 w-12 bg-white border-2 border-white hover:scale-110 transition-transform"
                  >
                    <X className="w-6 h-6 text-red-500 stroke-[2.5]" />
                  </Button>
                </div>

                {/* Like Button - PINK HEART - BOTTOM RIGHT (MIRROR OF X) */}
                <div
                  style={{
                    position: 'absolute',
                    right: '30px',
                    bottom: '30px',
                    zIndex: 999,
                    filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.4)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3))'
                  }}
                >
                  <Button
                    data-testid="button-like"
                    onClick={handleLike}
                    disabled={passMutation.isPending || likeMutation.isPending}
                    size="icon"
                    className="rounded-full h-12 w-12 bg-gradient-to-br from-pink-500 to-rose-600 hover:scale-110 transition-transform border-2 border-white"
                  >
                    <Heart className="w-6 h-6 fill-white text-white" />
                  </Button>
                </div>
              </div>

            {/* Profile Info - Scrollable with invisible scrollbar */}
            <div className="flex-[0.85] p-4 sm:p-6 overflow-y-auto border-t border-border scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <h3 className="text-xl sm:text-2xl font-light mb-1 text-foreground" data-testid="text-match-name">
                {currentProfile.name}
              </h3>
              <p className="text-primary mb-2 font-medium text-sm sm:text-base" data-testid="text-match-role">
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
              {currentProfile.bio && (
                <p className="text-foreground/80 leading-relaxed mb-3" data-testid="text-match-bio">
                  {currentProfile.bio}
                </p>
              )}
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                {currentProfile.height && <span>• {currentProfile.height}</span>}
                {currentProfile.eyeColor && <span>• {currentProfile.eyeColor} eyes</span>}
                {currentProfile.hairColor && <span>• {currentProfile.hairColor} hair</span>}
              </div>
            </div>
          </Card>
          </motion.div>
          </motion.div>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-background p-3 sm:p-4 flex justify-around border-t border-border">
          <button
            data-testid="nav-discover"
            className="text-primary p-2 hover-elevate active-elevate-2 rounded-md min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Heart className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-education"
            onClick={() => setLocation("/learn")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <BookOpen className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-messages"
            onClick={() => setLocation("/messages")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-profile"
            onClick={() => setLocation("/profile")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <User className="w-6 h-6" />
          </button>
        </nav>
      </div>
    </div>
  );
}
