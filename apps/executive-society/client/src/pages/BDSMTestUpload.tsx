import { useState, useRef } from "react";
import { ChevronLeft, Upload, Camera, FileImage, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function BDSMTestUpload() {
  const [, setLocation] = useLocation();
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (PNG, JPG, or PDF screenshot)",
        variant: "destructive"
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 10MB",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setUploadedImage(base64);
      localStorage.setItem('bdsmTestImage', base64);
      setIsUploading(false);
      
      toast({
        title: "Image uploaded successfully",
        description: "You can now continue to enter your test results"
      });
    };
    reader.readAsDataURL(file);
  };

  const handleContinue = () => {
    if (!uploadedImage) {
      toast({
        title: "No image uploaded",
        description: "Please upload your BDSM test results first",
        variant: "destructive"
      });
      return;
    }
    setLocation("/bdsm-test-input");
  };

  const handleSkip = () => {
    toast({
      title: "Test results skipped",
      description: "You can add this information later in your profile settings"
    });
    setLocation("/important-traits");
  };

  return (
    <div className="min-h-screen bg-muted p-6">
      <button
        data-testid="button-back"
        onClick={() => setLocation("/relationship-result")}
        className="mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">
          Upload Your BDSM Test Results
        </h2>
        <p className="text-muted-foreground mb-8 text-center">
          Upload a screenshot of your test results to help us improve your matches
        </p>

        <Card className="p-6 mb-6" data-testid="card-upload-info">
          <div className="flex gap-3 mb-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
              <FileImage className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-1">Why add test results?</h3>
              <p className="text-sm text-muted-foreground">
                External BDSM test results (like BDSMtest.org) provide detailed kink preferences that help us match you with highly compatible partners based on specific activities, roles, and interests.
              </p>
            </div>
          </div>
        </Card>

        {uploadedImage ? (
          <Card className="p-6 mb-6" data-testid="card-uploaded-preview">
            <div className="flex items-center gap-3 mb-4 text-green-600 dark:text-green-500">
              <CheckCircle className="w-6 h-6" />
              <span className="font-medium">Image uploaded successfully</span>
            </div>
            <img 
              src={uploadedImage} 
              alt="BDSM Test Results" 
              className="w-full rounded-md border border-border max-h-96 object-contain bg-background"
              data-testid="img-uploaded-preview"
            />
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
                data-testid="button-reupload"
              >
                <Upload className="w-4 h-4 mr-2" />
                Replace Image
              </Button>
            </div>
          </Card>
        ) : (
          <Card 
            className="p-12 mb-6 border-2 border-dashed hover-elevate active-elevate-2 cursor-pointer" 
            onClick={() => fileInputRef.current?.click()}
            data-testid="card-upload-dropzone"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                {isUploading ? (
                  <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera className="w-8 h-8 text-primary" />
                )}
              </div>
              <h3 className="text-lg font-medium mb-2 text-foreground">
                {isUploading ? "Uploading..." : "Upload Test Screenshot"}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Click to upload or drag and drop<br />
                PNG, JPG up to 10MB
              </p>
              <Button 
                variant="outline" 
                size="sm"
                type="button"
                disabled={isUploading}
                data-testid="button-browse"
              >
                <Upload className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </Card>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          data-testid="input-file-upload"
        />

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1"
            data-testid="button-skip"
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleContinue}
            disabled={!uploadedImage}
            className="flex-1"
            data-testid="button-continue"
          >
            Continue
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-6">
          Don't have test results? Visit <a href="https://bdsmtest.org" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">BDSMtest.org</a> to take a free comprehensive test
        </p>
      </div>
    </div>
  );
}
