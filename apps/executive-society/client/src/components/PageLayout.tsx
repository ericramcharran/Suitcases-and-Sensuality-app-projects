import { ReactNode } from "react";

interface PageLayoutProps {
  children: ReactNode;
  variant?: "default" | "centered" | "withBottomNav";
  className?: string;
  containerClassName?: string;
}

export function PageLayout({ 
  children, 
  variant = "default",
  className = "",
  containerClassName = ""
}: PageLayoutProps) {
  const baseClasses = "h-screen flex flex-col";
  
  if (variant === "centered") {
    return (
      <div className={`${baseClasses} ${className}`}>
        <div className={`flex-1 overflow-y-auto flex items-center justify-center ${containerClassName}`}>
          {children}
        </div>
      </div>
    );
  }
  
  if (variant === "withBottomNav") {
    return (
      <div className={`${baseClasses} ${className}`}>
        {children}
      </div>
    );
  }
  
  // Default variant - simple scrollable content
  return (
    <div className={`${baseClasses} ${className}`}>
      <div className={`flex-1 overflow-y-auto ${containerClassName}`}>
        {children}
      </div>
    </div>
  );
}
