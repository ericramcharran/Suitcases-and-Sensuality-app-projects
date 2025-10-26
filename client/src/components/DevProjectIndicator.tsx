import { Badge } from "@/components/ui/badge";
import { Heart, Sparkles, Home } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

interface DevProjectIndicatorProps {
  project: "executive" | "sparkit";
}

export function DevProjectIndicator({ project }: DevProjectIndicatorProps) {
  if (import.meta.env.PROD) return null;

  const config = {
    executive: {
      name: "Executive Society",
      icon: Heart,
      gradient: "from-rose-500 to-purple-500",
      color: "bg-rose-50 dark:bg-rose-950 border-rose-200 dark:border-rose-800",
    },
    sparkit: {
      name: "Spark It!",
      icon: Sparkles,
      gradient: "from-purple-600 to-rose-500",
      color: "bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800",
    },
  };

  const { name, icon: Icon, gradient, color } = config[project];

  return (
    <div className="fixed top-4 left-4 z-50 flex items-center gap-2">
      <Badge 
        variant="outline" 
        className={`${color} flex items-center gap-2 px-3 py-1.5 text-xs font-medium shadow-sm`}
      >
        <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${gradient} flex items-center justify-center`}>
          <Icon className="w-3.5 h-3.5 text-white" />
        </div>
        <span>Dev: {name}</span>
      </Badge>
      <Link href="/">
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-8 w-8"
          data-testid="button-home"
        >
          <Home className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}
