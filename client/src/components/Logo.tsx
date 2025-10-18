import logoImage from "@assets/logo.png";

export function Logo() {
  return (
    <div className="flex items-center justify-center">
      <img 
        src={logoImage} 
        alt="The Executive Society Logo" 
        className="w-32 sm:w-40 h-auto object-contain"
        style={{
          maxHeight: '80px',
          objectPosition: 'center'
        }}
      />
    </div>
  );
}
