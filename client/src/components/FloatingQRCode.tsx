import { QRCodeSVG } from "qrcode.react";
import { X, Smartphone } from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";

export function FloatingQRCode() {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get the full URL for the download page - memoized
  const downloadUrl = useMemo(() => `${window.location.origin}/download`, []);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="icon"
          className="h-14 w-14 rounded-full shadow-lg"
          data-testid="button-qr-toggle"
        >
          {isOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Smartphone className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* QR Code Modal */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-card border rounded-lg shadow-xl p-6 animate-in fade-in slide-in-from-bottom-2">
          <div className="text-center space-y-4">
            <h3 className="font-semibold text-lg">Scan to Download</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Scan this QR code with your phone to download the app
            </p>
            
            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg inline-block">
              <QRCodeSVG
                value={downloadUrl}
                size={200}
                level="H"
                includeMargin={false}
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              Works with iOS & Android
            </p>
          </div>
        </div>
      )}
    </>
  );
}
