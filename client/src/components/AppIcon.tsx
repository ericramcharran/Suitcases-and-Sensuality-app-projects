export default function AppIcon({ size = 300 }: { size?: number }) {
  return (
    <img 
      src="/sparkit-logo.png" 
      alt="Spark It! Logo"
      className="app-icon-unified" 
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
