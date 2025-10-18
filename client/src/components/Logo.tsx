import logoImage from "@assets/logo.png";

export function Logo() {
  return (
    <div className="flex items-center justify-center">
      <img 
        src={logoImage} 
        alt="The Executive Society Logo" 
        className="w-64 h-auto"
      />
    </div>
  );
}
