import { useEffect, useRef, useState } from "react";
import video1 from "@assets/18327-291012897_medium_1760967357313.mp4";
import video2 from "@assets/66481-517677516_medium_1760967357314.mp4";
import video3 from "@assets/98191-647151551_medium_1760967357314.mp4";

export function VideoBackground() {
  const videos = [video1, video2, video3];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const currentVideoRef = useRef<HTMLVideoElement>(null);
  const nextVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const currentVideo = currentVideoRef.current;
    if (!currentVideo) return;

    const handleCanPlay = () => {
      setIsLoaded(true);
    };

    const handleTimeUpdate = () => {
      // Start crossfade 1.5 seconds before video ends
      if (currentVideo.duration - currentVideo.currentTime < 1.5 && !isTransitioning) {
        setIsTransitioning(true);
        
        // Preload and play next video
        if (nextVideoRef.current) {
          nextVideoRef.current.load();
          nextVideoRef.current.play();
        }

        // After 1.5 seconds, swap videos
        setTimeout(() => {
          setCurrentIndex(nextIndex);
          setNextIndex((nextIndex + 1) % videos.length);
          setIsTransitioning(false);
        }, 1500);
      }
    };

    currentVideo.addEventListener("canplay", handleCanPlay);
    currentVideo.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      currentVideo.removeEventListener("canplay", handleCanPlay);
      currentVideo.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentIndex, nextIndex, isTransitioning, videos.length]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-0 pointer-events-none">
      {/* Gradient fallback (shows while video loads) */}
      <div 
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: isLoaded ? 0 : 0.2,
          background: 'radial-gradient(ellipse at 20% 30%, rgba(139, 0, 0, 0.4) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(75, 0, 130, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(0, 0, 0, 0.8) 0%, transparent 100%)',
        }}
      />

      {/* Current Video - Priority load */}
      <video
        ref={currentVideoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-1000"
        style={{ 
          opacity: isTransitioning ? 0 : (isLoaded ? 0.2 : 0),
          zIndex: 1
        }}
        data-testid="background-video-current"
      >
        <source src={videos[currentIndex]} type="video/mp4" />
      </video>

      {/* Next Video - Lazy load */}
      <video
        ref={nextVideoRef}
        muted
        playsInline
        preload="none"
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover transition-opacity duration-1000"
        style={{ 
          opacity: isTransitioning ? 0.2 : 0,
          zIndex: 2
        }}
        data-testid="background-video-next"
      >
        <source src={videos[nextIndex]} type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background/80 z-10" />
    </div>
  );
}
