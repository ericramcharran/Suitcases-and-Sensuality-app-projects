import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, CheckCircle, Download, Smartphone } from "lucide-react";
import animatedLogo from "@assets/crop animate logo_1760889514164.mp4";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useToast } from "@/hooks/use-toast";

export default function DownloadPage() {
  const [, setLocation] = useLocation();
  const { isInstallable, isInstalled, installApp } = usePWAInstall();
  const { toast } = useToast();

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      toast({
        title: "App Installing",
        description: "The Executive Society is being installed on your device!",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setLocation("/home")}
            data-testid="button-back"
            className="border-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6 w-full px-4">
              <div 
                className="overflow-hidden rounded-md w-full max-w-md" 
                style={{ 
                  aspectRatio: '19 / 12'
                }}
              >
                <video 
                  src={animatedLogo}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                  style={{
                    objectPosition: 'center center'
                  }}
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="text-lg sm:text-xl font-light text-muted-foreground mb-2">
                Install
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight">
                <div className="text-foreground">The Executive</div>
                <div className="text-primary">Society</div>
                <div className="text-muted-foreground">App</div>
              </h1>
            </div>
            <div className="text-xl text-muted-foreground max-w-2xl mx-auto">
              <p>Install the app on your device for the best experience.</p>
              <p>Works on iPhone, Android, and Desktop.</p>
            </div>
          </div>

          {/* Install Button */}
          {isInstalled ? (
            <Card className="p-8 mb-12 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-medium text-foreground mb-2">
                  App Already Installed!
                </h2>
                <p className="text-muted-foreground mb-6">
                  The Executive Society is already installed on this device. Look for the app icon on your home screen.
                </p>
                <Button
                  onClick={() => setLocation("/landing")}
                  size="lg"
                  className="rounded-full"
                  data-testid="button-open-app"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Open App
                </Button>
              </div>
            </Card>
          ) : isInstallable ? (
            <Card className="p-8 mb-12 bg-gradient-to-r from-primary/10 to-pink-500/10 border-primary/20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4">
                  <Download className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-medium text-foreground mb-2">
                  Install The Executive Society
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Click the button below to install The Executive Society as a native app on your device. No app store required!
                </p>
                <Button
                  onClick={handleInstall}
                  size="lg"
                  className="rounded-full"
                  data-testid="button-install-pwa"
                >
                  <Download className="w-5 h-5 mr-2" />
                  Install App Now
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-8 mb-12 bg-gradient-to-r from-primary/5 to-pink-500/5 border-primary/20">
              <div className="text-center">
                <h2 className="text-2xl font-medium text-foreground mb-4">
                  Install as a Web App
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  The Executive Society is a Progressive Web App (PWA). Add it to your home screen directly from your browser for a native app-like experience.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-foreground mb-1">iOS (Safari)</h3>
                      <p className="text-sm text-muted-foreground">
                        Tap the Share button (□↑), then "Add to Home Screen"
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-foreground mb-1">Android (Chrome)</h3>
                      <p className="text-sm text-muted-foreground">
                        Tap the menu (⋮), then "Add to Home screen" or "Install app"
                      </p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => setLocation("/landing")}
                  size="lg"
                  variant="outline"
                  className="rounded-full"
                  data-testid="button-use-web"
                >
                  <Smartphone className="w-5 h-5 mr-2" />
                  Use Web Version
                </Button>
              </div>
            </Card>
          )}

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Native App Experience</h3>
              <p className="text-sm text-muted-foreground">
                Full screen, no browser UI, feels like a real app
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Push Notifications</h3>
              <p className="text-sm text-muted-foreground">
                Get notified instantly about matches and messages
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Works Offline</h3>
              <p className="text-sm text-muted-foreground">
                Access your profile and browse while offline
              </p>
            </Card>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <Button
              onClick={() => setLocation("/landing")}
              size="lg"
              className="rounded-full"
              data-testid="button-get-started"
            >
              Get Started Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
