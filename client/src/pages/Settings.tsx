import { ChevronLeft, Bell, Shield, Eye, CreditCard, HelpCircle, LogOut, Info, MapPin, FileText, Lock, Book } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useLocation } from "wouter";
import { useCallback } from "react";

const settingsOptions = [
  {
    icon: Bell,
    title: "Notifications",
    description: "Push notifications and email alerts",
    hasSwitch: true,
    defaultValue: true
  },
  {
    icon: Lock,
    title: "App Permissions",
    description: "Camera, location, and notification access",
    hasSwitch: false,
    link: "/permissions"
  },
  {
    icon: FileText,
    title: "Legal Documents",
    description: "View signed agreements and signatures",
    hasSwitch: false,
    link: "/legal-documents"
  },
  {
    icon: Book,
    title: "BDSM Resources",
    description: "Educational definitions and lifestyle guides",
    hasSwitch: false,
    link: "/resources"
  },
  {
    icon: Shield,
    title: "Privacy",
    description: "View our privacy policy",
    hasSwitch: false,
    link: "/privacy-policy"
  },
  {
    icon: Eye,
    title: "Visibility",
    description: "Show or hide your profile",
    hasSwitch: true,
    defaultValue: true
  },
  {
    icon: CreditCard,
    title: "Subscription",
    description: "Manage your plan and billing",
    hasSwitch: false,
    link: "/subscription-management"
  },
  {
    icon: Info,
    title: "About This App",
    description: "Learn more about The Executive Society",
    hasSwitch: false,
    link: "/about"
  },
  {
    icon: HelpCircle,
    title: "Help & Support",
    description: "Get help and contact support",
    hasSwitch: false,
    link: "/help-support"
  },
];

export default function Settings() {
  const [, setLocation] = useLocation();

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/discover");
    }
  }, [setLocation]);

  return (
    <div className="h-screen bg-muted p-4 sm:p-6 overflow-y-auto">
      <button
        data-testid="button-back"
        onClick={handleBack}
        className="mb-4 sm:mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-2 rounded-md min-h-[44px]"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-md mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-light mb-4 sm:mb-6 text-foreground">Settings</h2>

        <div className="space-y-2 mb-6">
          {settingsOptions.map((option, i) => (
            <Card
              key={i}
              data-testid={`setting-${i}`}
              className="p-3 rounded-2xl cursor-pointer transition-colors hover:bg-primary/20 active-elevate-2"
              onClick={() => option.link && setLocation(option.link)}
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <option.icon className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm text-foreground">{option.title}</h3>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </div>
                {option.hasSwitch && (
                  <Switch
                    data-testid={`switch-${i}`}
                    defaultChecked={option.defaultValue}
                  />
                )}
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-3 mb-3 rounded-2xl bg-primary/10 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-primary">
                Account Status
              </h4>
              <p className="text-xs text-primary/80">
                Free Trial - 28 days remaining
              </p>
            </div>
          </div>
        </Card>

        <button
          data-testid="button-logout"
          className="w-full"
          onClick={() => {
            localStorage.removeItem('userId');
            localStorage.removeItem('userName');
            localStorage.removeItem('userRole');
            setLocation("/");
          }}
        >
          <Card className="p-3 rounded-2xl cursor-pointer transition-colors hover:bg-primary/20 active-elevate-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <LogOut className="w-4 h-4 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-sm text-foreground">Log Out</h3>
            </div>
          </Card>
        </button>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>Version 1.0.0</p>
          <p className="mt-1">
            <button onClick={() => setLocation("/about")} className="text-primary hover:underline">About</button>
            {" · "}
            <button onClick={() => setLocation("/terms")} className="text-primary hover:underline">Terms</button>
            {" · "}
            <button onClick={() => setLocation("/privacy")} className="text-primary hover:underline">Privacy</button>
            {" · "}
            <button onClick={() => setLocation("/guidelines")} className="text-primary hover:underline">Guidelines</button>
          </p>
        </div>
      </div>
    </div>
  );
}
