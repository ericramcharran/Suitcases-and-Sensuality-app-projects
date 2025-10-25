export default function AppIcon({ size = 300 }: { size?: number }) {
  return (
    <svg className="app-icon-unified" width={size} height={size} viewBox="0 0 200 200">
      <defs>
        <linearGradient id="nexusGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#667eea', stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: '#764ba2', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#e74c3c', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
      
      <rect width="200" height="200" fill="#0a0a0a" rx="44"/>
      
      <circle cx="100" cy="100" r="15" fill="url(#nexusGrad)">
        <animate attributeName="r" values="15;18;15" dur="3s" repeatCount="indefinite"/>
      </circle>
      
      <circle cx="60" cy="60" r="12" fill="#667eea"/>
      <circle cx="140" cy="60" r="12" fill="#764ba2"/>
      <circle cx="60" cy="140" r="12" fill="#c0392b"/>
      <circle cx="140" cy="140" r="12" fill="#e74c3c"/>
      
      <path d="M 60 60 Q 80 80 100 85" 
            stroke="url(#nexusGrad)" 
            strokeWidth="3" 
            fill="none" 
            opacity="0.6"/>
      <path d="M 140 60 Q 120 80 100 85" 
            stroke="url(#nexusGrad)" 
            strokeWidth="3" 
            fill="none" 
            opacity="0.6"/>
      <path d="M 60 140 Q 80 120 100 115" 
            stroke="url(#nexusGrad)" 
            strokeWidth="3" 
            fill="none" 
            opacity="0.6"/>
      <path d="M 140 140 Q 120 120 100 115" 
            stroke="url(#nexusGrad)" 
            strokeWidth="3" 
            fill="none" 
            opacity="0.6"/>
      
      <circle cx="100" cy="100" r="50" 
              stroke="url(#nexusGrad)" 
              strokeWidth="2" 
              fill="none" 
              opacity="0.3">
        <animate attributeName="r" values="50;55;50" dur="4s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.3;0.5;0.3" dur="4s" repeatCount="indefinite"/>
      </circle>
    </svg>
  );
}
