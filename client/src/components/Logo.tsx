import logoImage from "@assets/logo-1_1760791670509.png";

export function Logo() {
  return (
    <div className="flex items-center justify-center">
      <img 
        src={logoImage} 
        alt="The Executive Society Logo" 
        className="w-96 sm:w-[480px] h-auto object-contain"
        style={{
          maxHeight: '240px',
          objectPosition: 'center'
        }}
      />
    </div>
  );
}
