import { useState, useRef } from "react";
import { Shield, ChevronLeft, Camera, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";

export default function AgeVerification() {
  const [, setLocation] = useLocation();
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOver21 = () => {
    if (!dateOfBirth) return false;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 21;
    }
    return age >= 21;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Security validation: Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    // Security validation: Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      alert('Only JPG, PNG, WEBP, or PDF files are allowed');
      return;
    }

    setUploadedFile(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const canContinue = isOver21() && uploadedFile !== null;

  return (
    <div className="min-h-screen bg-muted p-6">
      <button
        data-testid="button-back"
        onClick={() => setLocation("/")}
        className="mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-red-500 to-black rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">
          Age Verification
        </h2>
        <p className="text-muted-foreground mb-8 text-center">
          You must be 21+ to continue
        </p>
        <Card className="p-8 mb-6">
          <div className="mb-6 text-center">
            <Label htmlFor="dob" className="text-foreground mb-2 block text-center">
              Date of Birth
            </Label>
            <div className="max-w-xs mx-auto">
              <Input
                data-testid="input-dob"
                id="dob"
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="rounded-xl text-center"
              />
            </div>
            {dateOfBirth && !isOver21() && (
              <p className="text-sm text-destructive mt-2">
                You must be 21 or older to use this platform
              </p>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,.pdf"
            capture="environment"
            onChange={handleFileSelect}
            className="hidden"
            data-testid="input-file"
          />

          <div 
            onClick={handleUploadClick}
            className={`border-2 border-dashed rounded-xl p-8 text-center mb-2 cursor-pointer transition-colors ${
              uploadedFile 
                ? 'border-green-500 bg-green-500/5' 
                : 'border-border hover:border-red-500'
            }`}
            data-testid="upload-area"
          >
            {uploadedFile ? (
              <>
                <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
                <p className="text-sm text-foreground font-medium">ID Uploaded</p>
                <p className="text-xs text-muted-foreground mt-1">{uploadedFile.name}</p>
              </>
            ) : (
              <>
                <Camera className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-foreground font-medium">Take Photo or Upload ID</p>
                <p className="text-xs text-muted-foreground mt-1">Passport or Driver's License required</p>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-center mb-2">
            Tap to use camera or select from files
          </p>
          <p className="text-xs text-muted-foreground text-center mb-6">
            Accepted: JPG, PNG, PDF • Max 10MB
          </p>
          
          <Button
            data-testid="button-verify"
            onClick={() => setLocation("/terms")}
            disabled={!canContinue}
            className="w-full rounded-full bg-red-500 hover:bg-black text-white transition-colors"
            size="lg"
          >
            {!dateOfBirth ? "Enter Date of Birth" : !uploadedFile ? "Upload ID Document" : "Verify Identity"}
          </Button>
        </Card>
      </div>
    </div>
  );
}
