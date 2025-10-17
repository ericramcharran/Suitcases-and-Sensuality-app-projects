export function Logo() {
  return (
    <div className="w-20 h-20 relative group cursor-pointer">
      {/* Background: Black -> Red on hover */}
      <div className="absolute inset-0 bg-black group-hover:bg-red-500 rounded-full transition-colors duration-300"></div>
      {/* Border: Red -> White on hover */}
      <div className="absolute inset-0 rounded-full border-4 border-red-500 group-hover:border-white transition-colors duration-300"></div>
      {/* Icon: White -> Black on hover */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg 
          className="w-10 h-10 text-white group-hover:text-black transition-colors duration-300" 
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
