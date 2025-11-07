import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface SparkitCardHeaderProps {
  title: string;
  subtitle?: string;
  backTo?: string;
  actions?: React.ReactNode;
  showBackButton?: boolean;
}

export function SparkitCardHeader({
  title,
  subtitle,
  backTo = "/spark",
  actions,
  showBackButton = true,
}: SparkitCardHeaderProps) {
  const [, setLocation] = useLocation();

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-nexus-purple to-nexus-red bg-clip-text text-transparent">
          {title}
        </h1>
        <div className="flex items-center gap-2">
          {actions}
          {showBackButton && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => setLocation(backTo)}
              data-testid="button-back"
              className="border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] backdrop-blur-sm bg-white/5"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      {subtitle && (
        <p className="text-sm text-gray-400 max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}
