import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import animatedLogo from "@assets/animated-logo2_1760887393286.mp4";

export default function LogoCropLive() {
  const [width, setWidth] = useState(160);
  const [height, setHeight] = useState(130);
  const [positionX, setPositionX] = useState(50);
  const [positionY, setPositionY] = useState(15);

  const copyToClipboard = () => {
    const code = `width: '${width}%',
height: '${height}%',
objectFit: 'cover',
objectPosition: '${positionX}% ${positionY}%'`;
    navigator.clipboard.writeText(code);
    alert('Crop values copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-medium text-foreground mb-2">Live Logo Crop Tool</h1>
          <p className="text-sm text-muted-foreground">
            Adjust the sliders below to crop your logo in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Preview */}
          <div>
            <h2 className="text-lg font-medium text-foreground mb-3">Preview</h2>
            <div className="bg-card rounded-lg p-8 flex items-center justify-center">
              <div 
                className="flex items-center justify-center overflow-hidden border-2 border-primary rounded-md" 
                style={{ 
                  width: '380px',
                  height: '240px'
                }}
              >
                <video 
                  src={animatedLogo} 
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{
                    width: `${width}%`,
                    height: `${height}%`,
                    objectFit: 'cover',
                    objectPosition: `${positionX}% ${positionY}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Controls */}
          <div>
            <h2 className="text-lg font-medium text-foreground mb-3">Crop Controls</h2>
            <Card className="p-6">
              <div className="space-y-6">
                {/* Width */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Width: {width}%</Label>
                    <Input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(Number(e.target.value))}
                      className="w-20 h-8 text-sm"
                      min={100}
                      max={300}
                    />
                  </div>
                  <Slider
                    data-testid="slider-width"
                    value={[width]}
                    onValueChange={(value) => setWidth(value[0])}
                    min={100}
                    max={300}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Crops left & right sides
                  </p>
                </div>

                {/* Height */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Height: {height}%</Label>
                    <Input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(Number(e.target.value))}
                      className="w-20 h-8 text-sm"
                      min={100}
                      max={300}
                    />
                  </div>
                  <Slider
                    data-testid="slider-height"
                    value={[height]}
                    onValueChange={(value) => setHeight(value[0])}
                    min={100}
                    max={300}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Crops top & bottom
                  </p>
                </div>

                {/* Position X */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Horizontal Position: {positionX}%</Label>
                    <Input
                      type="number"
                      value={positionX}
                      onChange={(e) => setPositionX(Number(e.target.value))}
                      className="w-20 h-8 text-sm"
                      min={0}
                      max={100}
                    />
                  </div>
                  <Slider
                    data-testid="slider-position-x"
                    value={[positionX]}
                    onValueChange={(value) => setPositionX(value[0])}
                    min={0}
                    max={100}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    0% = Left, 50% = Center, 100% = Right
                  </p>
                </div>

                {/* Position Y */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Vertical Position: {positionY}%</Label>
                    <Input
                      type="number"
                      value={positionY}
                      onChange={(e) => setPositionY(Number(e.target.value))}
                      className="w-20 h-8 text-sm"
                      min={0}
                      max={100}
                    />
                  </div>
                  <Slider
                    data-testid="slider-position-y"
                    value={[positionY]}
                    onValueChange={(value) => setPositionY(value[0])}
                    min={0}
                    max={100}
                    step={1}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    0% = Top, 50% = Center, 100% = Bottom
                  </p>
                </div>

                {/* Current Values Display */}
                <div className="pt-4 border-t border-border">
                  <Label className="text-sm font-medium mb-2 block">CSS Values:</Label>
                  <pre className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto">
{`width: '${width}%',
height: '${height}%',
objectFit: 'cover',
objectPosition: '${positionX}% ${positionY}%'`}
                  </pre>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button
                    data-testid="button-copy"
                    onClick={copyToClipboard}
                    className="flex-1"
                  >
                    Copy Values
                  </Button>
                  <Button
                    data-testid="button-reset"
                    variant="outline"
                    onClick={() => {
                      setWidth(160);
                      setHeight(130);
                      setPositionX(50);
                      setPositionY(15);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
