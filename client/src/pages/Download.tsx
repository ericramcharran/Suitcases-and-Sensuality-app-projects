import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { ArrowLeft, Smartphone, CheckCircle } from "lucide-react";
import { SiApple, SiGoogleplay } from "react-icons/si";

export default function Download() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation("/")}
            data-testid="button-back"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </header>

      <div className="pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Smartphone className="w-10 h-10 text-primary" />
            </div>
            <div className="mb-4">
              <div className="text-lg sm:text-xl font-light text-muted-foreground mb-2">
                Download
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light leading-tight">
                <div className="text-foreground">The Executive</div>
                <div className="text-primary">Society</div>
                <div className="text-muted-foreground">App</div>
              </h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get the app on your mobile device for the best experience. Available on iOS and Android.
            </p>
          </div>

          {/* Download Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 justify-center items-center mb-12">
            {/* App Store Button */}
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              data-testid="link-app-store"
            >
              <div className="bg-black hover-elevate active-elevate-2 cursor-pointer transition-all rounded-md px-3 py-2 h-11 flex items-center">
                <div className="flex items-center gap-2">
                  <SiApple className="w-6 h-6 text-white flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-[10px] leading-tight text-white/70">Download on the</div>
                    <div className="text-sm font-medium leading-tight text-white">App Store</div>
                  </div>
                </div>
              </div>
            </a>

            {/* Google Play Button */}
            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              data-testid="link-google-play"
            >
              <div className="bg-black hover-elevate active-elevate-2 cursor-pointer transition-all rounded-md px-3 py-2 h-11 flex items-center">
                <div className="flex items-center gap-2">
                  <SiGoogleplay className="w-5 h-5 text-white flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-[10px] leading-tight text-white/70">Get it on</div>
                    <div className="text-sm font-medium leading-tight text-white">Google Play</div>
                  </div>
                </div>
              </div>
            </a>
          </div>

          {/* Progressive Web App Option */}
          <Card className="p-8 mb-12 bg-gradient-to-r from-primary/5 to-pink-500/5 border-primary/20">
            <div className="text-center">
              <h2 className="text-2xl font-medium text-foreground mb-4">
                Or Use as a Web App
              </h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                The Executive Society is a Progressive Web App (PWA). You can add it to your home screen directly from your browser for a native app-like experience without downloading from the store.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground mb-1">iOS (Safari)</h3>
                    <p className="text-sm text-muted-foreground">
                      Tap the Share button, then "Add to Home Screen"
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Android (Chrome)</h3>
                    <p className="text-sm text-muted-foreground">
                      Tap the menu (⋮), then "Add to Home screen"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
                <CheckCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-medium text-foreground mb-2">Optimized for Mobile</h3>
              <p className="text-sm text-muted-foreground">
                Touch gestures, swipe interactions, and mobile-first design
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
