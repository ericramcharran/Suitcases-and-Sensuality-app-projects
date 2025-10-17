export function Logo() {
  return (
    <div className="w-20 h-20 relative">
      <div className="absolute inset-0 bg-gradient-to-br from-foreground to-muted-foreground rounded-full dark:from-gray-700 dark:to-gray-900"></div>
      <div className="absolute inset-0 rounded-full border-4 border-primary"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          className="w-10 h-10 text-primary-foreground" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 6v12M6 12h12" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}
