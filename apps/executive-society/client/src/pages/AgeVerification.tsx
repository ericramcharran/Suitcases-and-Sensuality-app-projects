import { useState, useRef } from "react";
import { Shield, ChevronLeft, Camera, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";

export default function AgeVerification() {
  const [, setLocation] = useLocation();
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [year, setYear] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isOver21 = () => {
    if (!month || !day || !year) return false;
    
    // Create date object (month is 0-indexed in JavaScript Date)
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    
    // Calculate age
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 21;
  };

  // Generate arrays for dropdowns
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" }
  ];

  const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

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

  const hasDateOfBirth = month && day && year;
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
        <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-br from-primary to-black rounded-full flex items-center justify-center">
          <Shield className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">
          Age Verification
        </h2>
        <p className="text-muted-foreground mb-8 text-center">
          You must be 21+ to continue
        </p>
        <Card className="p-8 mb-6">
          <div className="mb-6">
            <Label className="text-foreground mb-3 block text-center">
              Date of Birth (US Format)
            </Label>
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div>
                <Label htmlFor="month" className="text-xs text-muted-foreground mb-1 block">
                  Month
                </Label>
                <Select value={month} onValueChange={setMonth}>
                  <SelectTrigger 
                    id="month" 
                    data-testid="select-month"
                    className="rounded-xl"
                  >
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((m) => (
                      <SelectItem key={m.value} value={m.value}>
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="day" className="text-xs text-muted-foreground mb-1 block">
                  Day
                </Label>
                <Select value={day} onValueChange={setDay}>
                  <SelectTrigger 
                    id="day" 
                    data-testid="select-day"
                    className="rounded-xl"
                  >
                    <SelectValue placeholder="DD" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((d) => (
                      <SelectItem key={d} value={d}>
                        {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="year" className="text-xs text-muted-foreground mb-1 block">
                  Year
                </Label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger 
                    id="year" 
                    data-testid="select-year"
                    className="rounded-xl"
                  >
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((y) => (
                      <SelectItem key={y} value={y}>
                        {y}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {hasDateOfBirth && !isOver21() && (
              <p className="text-sm text-destructive mt-3 text-center">
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
                : 'border-border hover:border-primary'
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
            onClick={() => {
              if (!canContinue) return;
              
              // Store verification data in sessionStorage
              localStorage.setItem('verificationMonth', month);
              localStorage.setItem('verificationDay', day);
              localStorage.setItem('verificationYear', year);
              localStorage.setItem('hasUploadedId', 'true');
              
              // Navigate to verification processing page
              setLocation("/verification-processing");
            }}
            disabled={!canContinue}
            className="w-full rounded-full bg-primary hover:bg-primary/20 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            size="lg"
          >
            {!month || !day || !year 
              ? "Enter Date of Birth" 
              : !isOver21() 
              ? "You Must Be 21+" 
              : !uploadedFile 
              ? "Upload ID Document" 
              : "Verify Identity"
            }
          </Button>
        </Card>
      </div>
    </div>
  );
}
