import { ChevronLeft, Bell, Shield, Eye, CreditCard, HelpCircle, LogOut, Info, MapPin, FileText } from "lucide-react";
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
    icon: MapPin,
    title: "I am traveling",
    description: "Change your location for matching",
    hasSwitch: false,
    link: "/travel-mode"
  },
  {
    icon: FileText,
    title: "Legal Documents",
    description: "View signed agreements and signatures",
    hasSwitch: false,
    link: "/legal-documents"
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
    hasSwitch: false
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
    <div className="min-h-screen bg-muted p-4 sm:p-6">
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

        <div className="space-y-3 mb-6">
          {settingsOptions.map((option, i) => (
            <Card
              key={i}
              data-testid={`setting-${i}`}
              className="p-4 hover-elevate active-elevate-2 cursor-pointer"
              onClick={() => option.link && setLocation(option.link)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <option.icon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground">{option.title}</h3>
                  <p className="text-sm text-muted-foreground">{option.description}</p>
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

        <Card className="p-4 mb-4 bg-primary/10 border-primary/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-primary mb-1">
                Account Status
              </h4>
              <p className="text-sm text-primary/80">
                Free Trial - 28 days remaining
              </p>
            </div>
          </div>
        </Card>

        <button
          data-testid="button-logout"
          className="w-full"
          onClick={() => {
            sessionStorage.clear();
            setLocation("/");
          }}
        >
          <Card className="p-4 hover-elevate active-elevate-2 cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <LogOut className="w-5 h-5 text-muted-foreground" />
              </div>
              <h3 className="font-medium text-foreground">Log Out</h3>
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
