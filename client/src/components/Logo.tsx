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
            width: '160%',
            height: '130%',
            objectFit: 'cover',
            objectPosition: 'center 15%'
          }}
        />
      </div>
    </div>
  );
}
