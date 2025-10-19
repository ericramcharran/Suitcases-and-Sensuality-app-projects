import animatedLogo from "@assets/crop animate logo_1760889514164.mp4";

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
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
        />
      </div>
    </div>
  );
}
