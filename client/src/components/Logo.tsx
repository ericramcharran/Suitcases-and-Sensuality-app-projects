import animatedLogo from "@assets/animated-logo2_1760887393286.mp4";

export function Logo() {
  return (
    <div className="flex items-center justify-center">
      <div 
        className="overflow-hidden border-2 border-primary rounded-md" 
        style={{ 
          width: '380px',
          height: '240px'
        }}
      >
        <video 
          src={animatedLogo} 
          autoPlay
          muted
          playsInline
          style={{
            width: 'calc(100% + 1cm)',
            height: 'calc(100% + 1cm)',
            objectFit: 'cover',
            objectPosition: 'center',
            transform: 'scale(1.2)'
          }}
        />
      </div>
    </div>
  );
}
