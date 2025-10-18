import { useState, useCallback, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Verified, ChevronUp } from "lucide-react";
import useEmblaCarousel from 'embla-carousel-react';

interface ProfileCardProps {
  profile: {
    id: string;
    name: string;
    age?: number;
    role?: string;
    verified?: boolean;
    escrowBalance?: number;
    profileImages?: string[];
    bio?: string;
    city?: string;
    state?: string;
    height?: string;
    bodyType?: string;
    race?: string;
    profession?: string;
    drinking?: string;
    smoking?: string;
    fitnessLevel?: string;
    experienceLevel?: string;
    sexualOrientation?: string;
  };
  matchPercentage?: number;
  distance?: string;
  showActions?: boolean;
  className?: string;
}

export function ProfileCard({ 
  profile, 
  matchPercentage, 
  distance,
  showActions = false,
  className = ""
}: ProfileCardProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: false,
    axis: 'y'  // Vertical scrolling
  });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showArrow, setShowArrow] = useState(false);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

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

  // Show arrow on hover/touch
  const handleInteractionStart = () => {
    if (profile.profileImages && profile.profileImages.length > 1 && currentImageIndex < profile.profileImages.length - 1) {
      setShowArrow(true);
    }
  };

  const handleInteractionEnd = () => {
    setShowArrow(false);
  };

  return (
    <Card className={`h-full flex flex-col ${className}`} data-testid="profile-card">
      {/* Profile Image Carousel - 30% larger than before */}
      <div 
        className="relative bg-muted rounded-t-xl flex-[1.3] overflow-hidden"
        onMouseEnter={handleInteractionStart}
        onMouseLeave={handleInteractionEnd}
        onTouchStart={handleInteractionStart}
        onTouchEnd={handleInteractionEnd}
      >
        {profile.profileImages && profile.profileImages.length > 0 ? (
          <>
            {/* Vertical Carousel */}
            <div className="overflow-hidden h-full" ref={emblaRef}>
              <div className="flex flex-col h-full touch-pan-y">
                {profile.profileImages.map((imageUrl: string, idx: number) => (
                  <div key={idx} className="flex-[0_0_100%] min-h-0 relative">
                    <img
                      src={imageUrl}
                      alt={`${profile.name} ${idx + 1}`}
                      className="w-full h-full object-cover select-none"
                      data-testid={`image-profile-${idx}`}
                      draggable={false}
                    />
                    {/* Gradient overlay for better text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </div>
                ))}
              </div>
            </div>

            {/* Pull Up Arrow - Bottom Center */}
            {profile.profileImages.length > 1 && currentImageIndex < profile.profileImages.length - 1 && (
              <div
                className={`absolute bottom-16 left-1/2 -translate-x-1/2 transition-all duration-300 z-20 ${
                  showArrow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
              >
                <button
                  onClick={scrollNext}
                  className="bg-black/60 backdrop-blur-md text-white p-4 rounded-full hover:bg-black/80 active:bg-black/90 transition-all shadow-lg border border-white/20"
                  data-testid="button-pull-up"
                  aria-label="Next image"
                >
                  <ChevronUp className="w-6 h-6 animate-bounce" />
                </button>
              </div>
            )}

            {/* Pull-up instruction text */}
            {profile.profileImages.length > 1 && currentImageIndex < profile.profileImages.length - 1 && (
              <div
                className={`absolute bottom-32 left-1/2 -translate-x-1/2 transition-all duration-300 z-10 ${
                  showArrow ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <p className="text-white text-sm font-medium bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                  Swipe up for more photos
                </p>
              </div>
            )}

            {/* Pagination Dots */}
            {profile.profileImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-1.5 z-10">
                {profile.profileImages.map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentImageIndex
                        ? 'w-6 bg-white'
                        : 'w-1.5 bg-white/50'
                    }`}
                    data-testid={`dot-${idx}`}
                  />
                ))}
              </div>
            )}

            {/* Match Badge - Top Left */}
            {matchPercentage !== undefined && (
              <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-full font-medium text-sm z-10" data-testid="badge-match">
                {matchPercentage}% Match
              </div>
            )}

            {/* Distance Badge - Top Right */}
            {distance && (
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white px-3 py-1.5 rounded-full font-medium text-sm flex items-center gap-1 z-10" data-testid="badge-distance">
                <MapPin className="w-3.5 h-3.5" />
                {distance}
              </div>
            )}
          </>
        ) : (
          <div className="h-full flex items-center justify-center bg-muted">
            <p className="text-muted-foreground">No photos available</p>
          </div>
        )}
      </div>

      {/* Profile Info - Scrollable with invisible scrollbar */}
      <div className="flex-[0.85] p-4 sm:p-6 overflow-y-auto border-t border-border scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <h3 className="text-xl sm:text-2xl font-light mb-1 text-foreground" data-testid="text-profile-name">
          {profile.name}{profile.age ? `, ${profile.age}` : ''}
        </h3>
        <p className="text-primary mb-2 font-medium text-sm sm:text-base" data-testid="text-profile-role">
          {profile.role || 'Member'}
        </p>

        {/* Verification & Escrow Status */}
        {profile.verified && (
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant="secondary" className="flex items-center gap-1" data-testid="badge-verified">
              <Verified className="w-3 h-3" />
              ID Verified
            </Badge>
            {profile.escrowBalance && profile.escrowBalance > 0 && (
              <Badge variant="secondary" data-testid="badge-escrow">
                Escrow Verified (${profile.escrowBalance.toLocaleString()})
              </Badge>
            )}
          </div>
        )}

        {/* Bio */}
        {profile.bio && (
          <p className="text-foreground/80 mb-4 text-sm leading-relaxed" data-testid="text-bio">
            {profile.bio}
          </p>
        )}

        {/* Location */}
        {(profile.city || profile.state) && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Location</h4>
            <p className="text-foreground text-sm" data-testid="text-location">
              {profile.city}{profile.city && profile.state ? ', ' : ''}{profile.state}
            </p>
          </div>
        )}

        {/* Physical Details */}
        {(profile.height || profile.bodyType || profile.race) && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Physical Details</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {profile.height && (
                <div>
                  <span className="text-muted-foreground">Height:</span>{" "}
                  <span className="text-foreground" data-testid="text-height">{profile.height}</span>
                </div>
              )}
              {profile.bodyType && (
                <div>
                  <span className="text-muted-foreground">Build:</span>{" "}
                  <span className="text-foreground" data-testid="text-body-type">{profile.bodyType}</span>
                </div>
              )}
              {profile.race && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Ethnicity:</span>{" "}
                  <span className="text-foreground" data-testid="text-race">{profile.race}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Lifestyle */}
        {(profile.profession || profile.drinking || profile.smoking || profile.fitnessLevel) && (
          <div className="mb-4">
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Lifestyle</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {profile.profession && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Profession:</span>{" "}
                  <span className="text-foreground" data-testid="text-profession">{profile.profession}</span>
                </div>
              )}
              {profile.drinking && (
                <div>
                  <span className="text-muted-foreground">Drinking:</span>{" "}
                  <span className="text-foreground" data-testid="text-drinking">{profile.drinking}</span>
                </div>
              )}
              {profile.smoking && (
                <div>
                  <span className="text-muted-foreground">Smoking:</span>{" "}
                  <span className="text-foreground" data-testid="text-smoking">{profile.smoking}</span>
                </div>
              )}
              {profile.fitnessLevel && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Fitness:</span>{" "}
                  <span className="text-foreground" data-testid="text-fitness">{profile.fitnessLevel}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Relationship Preferences */}
        {(profile.experienceLevel || profile.sexualOrientation) && (
          <div>
            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Preferences</h4>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {profile.experienceLevel && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Experience:</span>{" "}
                  <span className="text-foreground" data-testid="text-experience">{profile.experienceLevel}</span>
                </div>
              )}
              {profile.sexualOrientation && (
                <div className="col-span-2">
                  <span className="text-muted-foreground">Orientation:</span>{" "}
                  <span className="text-foreground" data-testid="text-orientation">{profile.sexualOrientation}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
