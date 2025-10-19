import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import animatedLogo from "@assets/crop animate logo_1760889514164.mp4";

export default function LogoCrop() {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const applyCrop = () => {
    if (croppedAreaPixels) {
      alert(`Crop values:\nX: ${Math.round(croppedAreaPixels.x)}\nY: ${Math.round(croppedAreaPixels.y)}\nWidth: ${Math.round(croppedAreaPixels.width)}\nHeight: ${Math.round(croppedAreaPixels.height)}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-medium text-foreground mb-4">Logo Crop Tool</h1>
        
        {/* Cropper Area */}
        <div className="relative w-full h-[500px] bg-card rounded-md overflow-hidden mb-4">
          <Cropper
            video={animatedLogo}
            crop={crop}
            zoom={zoom}
            aspect={380 / 240}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
          />
        </div>

        {/* Controls */}
        <Card className="p-6 mb-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                Zoom: {zoom.toFixed(2)}x
              </label>
              <Slider
                data-testid="slider-zoom"
                value={[zoom]}
                onValueChange={(value) => setZoom(value[0])}
                min={1}
                max={3}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
        </Card>

        {/* Crop Info */}
        {croppedAreaPixels && (
          <Card className="p-4 mb-4 bg-muted">
            <h3 className="text-sm font-medium text-foreground mb-2">Crop Coordinates (pixels)</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-muted-foreground">X:</span>{" "}
                <span className="font-mono text-foreground">{Math.round(croppedAreaPixels.x)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Y:</span>{" "}
                <span className="font-mono text-foreground">{Math.round(croppedAreaPixels.y)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Width:</span>{" "}
                <span className="font-mono text-foreground">{Math.round(croppedAreaPixels.width)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Height:</span>{" "}
                <span className="font-mono text-foreground">{Math.round(croppedAreaPixels.height)}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            data-testid="button-apply-crop"
            onClick={applyCrop}
            className="flex-1"
          >
            Apply Crop
          </Button>
          <Button
            data-testid="button-reset"
            variant="outline"
            onClick={() => {
              setCrop({ x: 0, y: 0 });
              setZoom(1);
            }}
          >
            Reset
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mt-4 text-center">
          Drag to reposition • Scroll/pinch to zoom • Use slider for precise zoom control
        </p>
      </div>
    </div>
  );
}
