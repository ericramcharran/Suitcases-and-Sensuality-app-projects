import animatedLogo from "@assets/animate-logo_1760885812763.mp4";

export function Logo() {
  return (
    <div className="flex items-center justify-center">
      <video 
        src={animatedLogo} 
        autoPlay
        muted
        playsInline
        className="w-96 sm:w-[480px] h-auto object-contain"
        style={{
          maxHeight: '240px',
          objectPosition: 'center'
        }}
      />
    </div>
  );
}
