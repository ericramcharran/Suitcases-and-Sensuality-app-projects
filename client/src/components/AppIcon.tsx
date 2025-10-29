export default function AppIcon({ size = 300, showShadow = false }: { size?: number; showShadow?: boolean }) {
  return (
    <img 
      src="/sparkit-logo.png" 
      alt="Spark It! Logo"
      className={showShadow ? "app-icon-unified" : ""} 
      width={size} 
      height={size}
      style={{ 
        width: `${size}px`, 
        height: `${size}px`,
        objectFit: 'contain'
      }}
    />
  );
}
