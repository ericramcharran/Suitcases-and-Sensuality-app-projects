import animatedLogo from "@assets/animated-logo2_1760887393286.mp4";

export function Logo() {
  return (
    <div className="flex items-center justify-center">
      <video 
        src={animatedLogo} 
        autoPlay
        muted
        playsInline
        className="w-96 sm:w-[480px] h-auto object-contain border-2 border-primary rounded-md"
        style={{
          maxHeight: '240px',
          objectPosition: 'center'
        }}
      />
    </div>
  );
}
