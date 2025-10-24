import animatedLogo from "@assets/crop animate logo_1760889514164.mp4";

export function Logo() {
  return (
    <div className="flex items-center justify-center w-full px-4">
      <div 
        className="overflow-hidden rounded-md w-full max-w-md bg-transparent" 
        style={{ 
          aspectRatio: '19 / 12'
        }}
      >
        <video 
          src={animatedLogo} 
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover bg-transparent"
          style={{
            objectPosition: 'center center'
          }}
        />
      </div>
    </div>
  );
}
