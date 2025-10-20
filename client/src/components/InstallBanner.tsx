import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Smartphone } from "lucide-react";
import { usePWAInstall } from "@/hooks/usePWAInstall";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export function InstallBanner() {
  const { isInstallable, isInstalled, installApp } = usePWAInstall();
  const { toast } = useToast();
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("installBannerDismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
    }
  }, []);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      toast({
        title: "App Installing",
        description: "The Executive Society is being installed on your device!",
      });
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("installBannerDismissed", "true");
  };

  if (!isInstallable || isInstalled || isDismissed) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50"
      >
        <div className="bg-gradient-to-r from-primary to-pink-600 text-white rounded-lg shadow-2xl p-4 relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="absolute top-2 right-2 h-6 w-6 text-white hover:bg-white/20"
            data-testid="button-dismiss-install"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="pr-8">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-0.5">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">
                  Install The Executive Society
                </h3>
                <p className="text-sm text-white/90 mb-3">
                  Get the full app experience with one click!
                </p>
                
                <Button
                  onClick={handleInstall}
                  size="sm"
                  className="bg-white text-primary hover:bg-white/90 font-medium"
                  data-testid="button-install-banner"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Install Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
