import { useState, useEffect, useMemo } from "react";
import { Heart, MessageCircle, Settings, User, BookOpen, X, MapPin, Shield } from "lucide-react";

// Helper function to format last active time
const formatLastActive = (lastActive: string) => {
  const now = new Date();
  const activeDate = new Date(lastActive);
  const diffMs = now.getTime() - activeDate.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
};
import HeartTransition from "@/components/HeartTransition";
import { ParticleEffect } from "@/components/ParticleEffect";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { SparkleEffect } from "@/components/SparkleEffect";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { motion, useMotionValue, useTransform, PanInfo, useReducedMotion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { DiscoverFilters, type FilterOptions } from "@/components/DiscoverFilters";

export default function Discover() {
  const [, setLocation] = useLocation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [includeReviewed, setIncludeReviewed] = useState(false);
  const [minLoadingTimePassed, setMinLoadingTimePassed] = useState(false);
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  const [filters, setFilters] = useState<FilterOptions>({
    minAge: 21,
    maxAge: 99,
    maxDistance: 1000,
    minCompatibility: 0,
  });
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -100, 0, 100, 200], [0, 1, 1, 1, 0]);
  
  // Overlay visibility driven by motion values (fixes render issue)
  const passOverlayOpacity = useTransform(x, [-200, -50, 0], [1, 1, 0]);
  const passOverlayScale = useTransform(x, [-200, -50, 0], [1, 1, 0.5]);
  const likeOverlayOpacity = useTransform(x, [0, 50, 200], [0, 1, 1]);
  const likeOverlayScale = useTransform(x, [0, 50, 200], [0.5, 1, 1]);
  
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, axis: 'y' });
  
  const userId = localStorage.getItem('userId');
  
  // Particle effect triggers
  const [likeParticleTrigger, setLikeParticleTrigger] = useState(0);
  const [passParticleTrigger, setPassParticleTrigger] = useState(0);

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

  // Ensure beating heart shows for at least 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingTimePassed(true);
    }, 5000); // 5 seconds

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

  // Apply filters to potential matches
  const filteredMatches = useMemo(() => {
    if (!potentialMatches) return [];
    
    return potentialMatches.filter(match => {
      // Age filter (minimum 21)
      if (filters.minAge && match.age < filters.minAge) return false;
      if (filters.maxAge && match.age > filters.maxAge) return false;
      
      // Compatibility filter
      if (filters.minCompatibility && match.matchPercentage < filters.minCompatibility) return false;
      
      // Role filter
      if (filters.role && match.role !== filters.role) return false;
      
      // Experience level filter
      if (filters.experienceLevel && match.experienceLevel !== filters.experienceLevel) return false;
      
      // Body type filter
      if (filters.bodyType && match.bodyType !== filters.bodyType) return false;
      
      // Drinking filter
      if (filters.drinking && match.drinking !== filters.drinking) return false;
      
      // Smoking filter
      if (filters.smoking && match.smoking !== filters.smoking) return false;
      
      // Fitness level filter
      if (filters.fitnessLevel && match.fitnessLevel !== filters.fitnessLevel) return false;
      
      return true;
    });
  }, [potentialMatches, filters]);

  // Count active filters (excluding defaults)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.minAge && filters.minAge > 21) count++;
    if (filters.maxAge && filters.maxAge < 99) count++;
    if (filters.maxDistance && filters.maxDistance < 1000) count++;
    if (filters.minCompatibility && filters.minCompatibility > 0) count++;
    if (filters.role) count++;
    if (filters.experienceLevel) count++;
    if (filters.bodyType) count++;
    if (filters.drinking) count++;
    if (filters.smoking) count++;
    if (filters.fitnessLevel) count++;
    return count;
  }, [filters]);

  const profiles = filteredMatches || [];
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
      setLikeParticleTrigger(prev => prev + 1);
      likeMutation.mutate(currentProfile.id);
    }
  };

  const handlePass = () => {
    if (currentProfile) {
      setPassParticleTrigger(prev => prev + 1);
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
          <Heart className="w-16 h-16 text-primary animate-pulse mx-auto mb-4" />
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
          <Heart className="w-16 h-16 text-primary/30 mx-auto mb-4" />
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
              className="rounded-full bg-primary hover:bg-primary/20 text-white transition-colors px-12"
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
      {/* Particle Effects */}
      <ParticleEffect type="like" trigger={likeParticleTrigger} />
      <ParticleEffect type="pass" trigger={passParticleTrigger} />
      
      <div className="max-w-md mx-auto h-screen w-full flex flex-col">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-border flex justify-between items-center bg-background">
          <h2 className="text-xl sm:text-2xl font-light text-foreground">Discover</h2>
          <div className="flex gap-2">
            <DiscoverFilters
              filters={filters}
              onFiltersChange={(newFilters) => {
                setFilters(newFilters);
                setCurrentIndex(0); // Reset to first profile when filters change
              }}
              activeFilterCount={activeFilterCount}
            />
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
              key={currentProfile.id}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25 
              }}
              style={{ x, rotate, opacity }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              whileDrag={{ scale: 1.05, cursor: "grabbing" }}
              className="h-full"
            >
            <Card className="h-full flex flex-col shadow-2xl" data-testid="match-card">
              {/* Profile Image Carousel - 30% larger than before */}
              <div className="relative bg-muted rounded-t-xl flex-[1.3] overflow-hidden">
                {currentProfile.profileImages && currentProfile.profileImages.length > 0 ? (
                  <>
                    {/* Carousel - Vertical Scroll */}
                    <div className="overflow-hidden h-full" ref={emblaRef}>
                      <div className="flex flex-col h-full">
                        {currentProfile.profileImages.map((imageUrl: string, idx: number) => (
                          <div key={idx} className="flex-[0_0_100%] min-h-0 relative h-full">
                            <img
                              src={imageUrl}
                              alt={`${currentProfile.profileName || currentProfile.name} ${idx + 1}`}
                              className="w-full h-full object-cover"
                              data-testid={`image-profile-${idx}`}
                            />
                            {/* Gradient overlay for better text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Image Indicators - Vertical Left */}
                    {currentProfile.profileImages.length > 1 && (
                      <div className="absolute left-4 top-0 bottom-0 flex flex-col justify-center gap-1 z-10">
                        {currentProfile.profileImages.map((_: any, idx: number) => (
                          <div
                            key={idx}
                            className={`w-1 rounded-full transition-all ${
                              idx === currentImageIndex
                                ? 'h-8 bg-white'
                                : 'h-1 bg-white/50'
                            }`}
                            data-testid={`indicator-${idx}`}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gradient-to-br from-primary/60 to-pink-500/60 h-full flex items-center justify-center">
                    <Avatar className="w-32 h-32">
                      <AvatarFallback className="text-5xl bg-primary/20">
                        {(currentProfile.profileName || currentProfile.name).charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}

                {/* Match Percentage Badge with Animation & Sparkles */}
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 260, 
                        damping: 20,
                        delay: 0.1
                      }}
                      className={`absolute top-4 right-4 text-white text-sm px-3 py-1.5 rounded-full font-bold z-10 cursor-default shadow-lg ${
                        currentProfile.matchPercentage >= 80 
                          ? "bg-gradient-to-r from-green-500 to-emerald-600" 
                          : currentProfile.matchPercentage >= 60
                          ? "bg-gradient-to-r from-blue-500 to-cyan-600"
                          : "bg-gradient-to-r from-orange-500 to-amber-600"
                      }`}
                      data-testid="badge-match-percentage"
                    >
                      <AnimatedCounter value={currentProfile.matchPercentage} />%
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p className="font-semibold mb-1">{currentProfile.matchPercentage}% Compatibility</p>
                    <p className="text-sm mb-2">This score is based on multiple compatibility factors:</p>
                    <ul className="text-xs space-y-1 mb-2">
                      <li>• Personality traits & values</li>
                      <li>• Relationship preferences & style</li>
                      <li>• Role compatibility ({currentProfile.role})</li>
                      <li>• Important traits overlap</li>
                      <li>• Kink preferences (BDSM test results)*</li>
                    </ul>
                    <p className="text-xs text-muted-foreground">*When both users have uploaded test results, kink compatibility significantly enhances matching accuracy</p>
                  </TooltipContent>
                </Tooltip>
                
                {/* Sparkle Effect for High Matches */}
                <SparkleEffect show={currentProfile.matchPercentage >= 80} />

                {/* Verified & Fully Funded Badge for Dominants (replaces standard verified badge) */}
                {currentProfile.escrowVerified && currentProfile.fullyFunded ? (
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg z-10 font-semibold cursor-default" data-testid="badge-fully-funded">
                        <Shield className="w-3.5 h-3.5" />
                        Verified & Fully Funded
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-semibold mb-1">Premium Verification</p>
                      <p className="text-sm">This Dominant has completed both identity verification and escrow/mutual fund verification with full funding. This provides maximum trust and safety for all interactions.</p>
                    </TooltipContent>
                  </Tooltip>
                ) : currentProfile.verified && (
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                      <div className="absolute top-4 left-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 z-10 cursor-default" data-testid="badge-verified">
                        <Shield className="w-3 h-3" />
                        Verified {currentProfile.role}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="font-semibold mb-1">Identity Verified</p>
                      <p className="text-sm">This user has completed identity verification including age verification and background check. Their profile has been authenticated for your safety.</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                
                {/* Swipe Hint Overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-1/3 flex items-center justify-center pointer-events-none">
                  <motion.div
                    style={{
                      opacity: passOverlayOpacity,
                      scale: passOverlayScale
                    }}
                    className="bg-gradient-to-br from-red-500 to-pink-500 text-white px-6 py-3 rounded-2xl font-bold text-xl -rotate-12 shadow-2xl border-4 border-white"
                  >
                    PASS
                  </motion.div>
                </div>
                <div className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-center pointer-events-none">
                  <motion.div
                    style={{
                      opacity: likeOverlayOpacity,
                      scale: likeOverlayScale
                    }}
                    className="bg-gradient-to-br from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl font-bold text-xl rotate-12 shadow-2xl border-4 border-white"
                  >
                    LIKE
                  </motion.div>
                </div>

                {/* Floating Action Buttons - LOCKED IN POSITION */}
                {/* Pass Button - WHITE X - Uses saved position */}
                <motion.div
                  animate={!shouldReduceMotion ? { 
                    scale: [1, 1.05, 1],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    position: 'absolute',
                    left: `${savedPassPosition.x}px`,
                    bottom: `${savedPassPosition.y}px`,
                    zIndex: 999,
                    filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.4)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3))'
                  }}
                >
                  <motion.div whileTap={!shouldReduceMotion ? { scale: 0.9 } : {}}>
                    <Button
                      data-testid="button-pass"
                      onClick={handlePass}
                      disabled={passMutation.isPending || likeMutation.isPending}
                      size="icon"
                      variant="secondary"
                      className="rounded-full h-14 w-14 bg-white border-3 border-white hover:scale-110 transition-transform"
                    >
                      <X className="w-7 h-7 text-primary stroke-[2.5]" />
                    </Button>
                  </motion.div>
                </motion.div>

                {/* Like Button - ROSE HEART - BOTTOM RIGHT (MIRROR OF X) */}
                <motion.div
                  animate={!shouldReduceMotion ? { 
                    scale: [1, 1.05, 1],
                  } : {}}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                  style={{
                    position: 'absolute',
                    right: '30px',
                    bottom: '30px',
                    zIndex: 999,
                    filter: 'drop-shadow(0 10px 25px rgba(0, 0, 0, 0.4)) drop-shadow(0 6px 12px rgba(0, 0, 0, 0.3))'
                  }}
                >
                  <motion.div whileTap={!shouldReduceMotion ? { scale: 0.9 } : {}}>
                    <Button
                      data-testid="button-like"
                      onClick={handleLike}
                      disabled={passMutation.isPending || likeMutation.isPending}
                      size="icon"
                      className="rounded-full h-14 w-14 bg-gradient-to-br from-primary to-pink-500 hover:scale-110 transition-transform border-3 border-white shadow-lg"
                    >
                      <Heart className="w-7 h-7 fill-white text-white" />
                    </Button>
                  </motion.div>
                </motion.div>
              </div>

            {/* Profile Info - Scrollable with invisible scrollbar */}
            <div className="flex-[0.85] p-4 sm:p-6 overflow-y-auto border-t border-border scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <p className="text-primary mb-3 font-medium text-lg sm:text-xl text-center" data-testid="text-match-role">
                {currentProfile.role}
              </p>
              <h3 className="text-xl sm:text-2xl font-light mb-1 text-foreground" data-testid="text-match-name">
                {currentProfile.profileName || currentProfile.name}
              </h3>
              <div className="flex items-center gap-3 text-muted-foreground text-sm mb-3">
                {currentProfile.age && (
                  <span data-testid="text-match-age">{currentProfile.age} years old</span>
                )}
                {currentProfile.lastActive && (
                  <span data-testid="text-match-last-active">
                    Active {formatLastActive(currentProfile.lastActive)}
                  </span>
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-3 flex items-center gap-1" data-testid="text-match-distance">
                <MapPin className="w-4 h-4" />
                Location hidden for privacy
              </p>
              
              {/* Bio - appears directly below location */}
              {currentProfile.bio && (
                <p className="text-foreground/80 leading-relaxed mb-3" data-testid="text-match-bio">
                  {currentProfile.bio}
                </p>
              )}
              
              {currentProfile.escrowVerified && currentProfile.fullyFunded && (
                <Card className="p-3 mb-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/20" data-testid="card-escrow-info">
                  <p className="text-xs font-semibold mb-1 flex items-center gap-1 text-amber-700 dark:text-amber-400">
                    <Shield className="w-3.5 h-3.5" />
                    Verified & Fully Funded
                  </p>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    This Dom has completed escrow/mutual fund verification with full funding for maximum trust and safety
                  </p>
                </Card>
              )}
              {currentProfile.escrowBalance > 0 && !currentProfile.fullyFunded && currentProfile.role === 'Dominant' && (
                <Card className="p-3 mb-3 bg-blue-500/10 border-blue-500/20" data-testid="card-escrow-partial">
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1 flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Escrow Protected
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400">
                    This Dom has active escrow for your safety
                  </p>
                </Card>
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
