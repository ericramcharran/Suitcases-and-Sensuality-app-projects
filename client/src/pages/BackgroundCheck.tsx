import { useState } from "react";
import { Shield, ChevronLeft, AlertCircle, CheckCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useLocation } from "wouter";

export default function BackgroundCheck() {
  const [, setLocation] = useLocation();
  
  // Form state
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [ssn, setSsn] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  
  // Consent checkboxes
  const [agreeDisclosure, setAgreeDisclosure] = useState(false);
  const [agreeAuthorization, setAgreeAuthorization] = useState(false);
  const [agreeAccuracy, setAgreeAccuracy] = useState(false);

  const userRole = sessionStorage.getItem('userRole') || "Dominant";
  const isDominant = userRole === "Dominant";

  // Format SSN with dashes
  const formatSSN = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 5) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 5)}-${numbers.slice(5, 9)}`;
  };

  const handleSSNChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSsn(formatSSN(e.target.value));
  };

  const canContinue = 
    firstName.trim() &&
    lastName.trim() &&
    ssn.replace(/\D/g, '').length === 9 &&
    address.trim() &&
    city.trim() &&
    state.trim() &&
    zipCode.trim().length === 5 &&
    agreeDisclosure &&
    agreeAuthorization &&
    agreeAccuracy;

  const handleSubmit = () => {
    // Store background check data
    sessionStorage.setItem('backgroundCheckSubmitted', 'true');
    sessionStorage.setItem('backgroundCheckName', `${firstName} ${lastName}`);
    sessionStorage.setItem('backgroundCheckCity', city);
    sessionStorage.setItem('backgroundCheckState', state);
    
    // Navigate to processing page
    setLocation('/background-check-processing');
  };

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-6">
      <button
        data-testid="button-back"
        onClick={() => window.history.back()}
        className="mb-4 sm:mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-2 rounded-md min-h-[44px]"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-black flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-light mb-2 text-foreground">
            Background Verification
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">
            {isDominant 
              ? "Required for all Dominant members to ensure community safety"
              : "Enhanced verification for premium members"}
          </p>
        </div>

        {/* What We Check */}
        <Card className="p-4 sm:p-6 mb-6 bg-gradient-to-br from-primary/5 to-black/5">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-primary" />
            What We Verify
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Identity verification</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Criminal records</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Sex offender registry</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Address history</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">SSN validation</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">Violent crime history</span>
            </div>
          </div>
        </Card>

        {/* Personal Information */}
        <Card className="p-4 sm:p-6 mb-6">
          <h3 className="font-medium text-foreground mb-4">Personal Information</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-sm">
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  data-testid="input-first-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="rounded-xl mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="middleName" className="text-sm">
                  Middle Name
                </Label>
                <Input
                  id="middleName"
                  data-testid="input-middle-name"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  placeholder="Optional"
                  className="rounded-xl mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="lastName" className="text-sm">
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  data-testid="input-last-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="rounded-xl mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="ssn" className="text-sm">
                Social Security Number *
              </Label>
              <Input
                id="ssn"
                data-testid="input-ssn"
                value={ssn}
                onChange={handleSSNChange}
                placeholder="XXX-XX-XXXX"
                maxLength={11}
                className="rounded-xl mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Encrypted and used only for verification
              </p>
            </div>

            <div>
              <Label htmlFor="address" className="text-sm">
                Street Address *
              </Label>
              <Input
                id="address"
                data-testid="input-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main Street"
                className="rounded-xl mt-1"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-1">
                <Label htmlFor="city" className="text-sm">
                  City *
                </Label>
                <Input
                  id="city"
                  data-testid="input-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="New York"
                  className="rounded-xl mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="state" className="text-sm">
                  State *
                </Label>
                <Input
                  id="state"
                  data-testid="input-state"
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  placeholder="NY"
                  maxLength={2}
                  className="rounded-xl mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="zipCode" className="text-sm">
                  ZIP Code *
                </Label>
                <Input
                  id="zipCode"
                  data-testid="input-zip"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="10001"
                  maxLength={5}
                  className="rounded-xl mt-1"
                />
              </div>
            </div>
          </div>
        </Card>

        {/* FCRA Disclosure */}
        <Card className="p-4 sm:p-6 mb-6 border-amber-500/20 bg-amber-500/5">
          <h3 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" />
            Required Disclosures
          </h3>
          
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-background rounded-lg border border-border max-h-48 overflow-y-auto">
              <p className="font-medium mb-2">DISCLOSURE AND AUTHORIZATION</p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The Executive Society ("Company") may obtain information about you from a consumer 
                reporting agency for employment purposes. This information may include criminal history, 
                motor vehicle records, and other background information.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You have rights under the Fair Credit Reporting Act (FCRA). A summary of your rights 
                is provided separately. You may request additional information about the nature and 
                scope of any investigative consumer report by contacting us at privacy@theexecutivesociety.com.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                By checking the boxes below, you acknowledge receipt of this disclosure and authorize 
                the Company to obtain such reports.
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="disclosure"
                  data-testid="checkbox-disclosure"
                  checked={agreeDisclosure}
                  onCheckedChange={(checked) => setAgreeDisclosure(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="disclosure" className="text-sm cursor-pointer">
                  I acknowledge receipt of the Summary of Rights under the FCRA and authorize 
                  The Executive Society to obtain consumer reports about me.
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="authorization"
                  data-testid="checkbox-authorization"
                  checked={agreeAuthorization}
                  onCheckedChange={(checked) => setAgreeAuthorization(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="authorization" className="text-sm cursor-pointer">
                  I authorize the Company to conduct a comprehensive background check, including 
                  criminal records, sex offender registry, and address history verification.
                </Label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="accuracy"
                  data-testid="checkbox-accuracy"
                  checked={agreeAccuracy}
                  onCheckedChange={(checked) => setAgreeAccuracy(checked as boolean)}
                  className="mt-1"
                />
                <Label htmlFor="accuracy" className="text-sm cursor-pointer">
                  I certify that the information provided above is true and accurate to the 
                  best of my knowledge.
                </Label>
              </div>
            </div>
          </div>
        </Card>

        {/* Privacy Notice */}
        <Card className="p-4 mb-6 bg-muted border-border">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-foreground mb-1 text-sm">Your Privacy Matters</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                All information is encrypted end-to-end and processed by our trusted verification partner. 
                Your SSN is never stored on our servers and is deleted immediately after verification. 
                Results typically available within 3-5 business days.
              </p>
            </div>
          </div>
        </Card>

        {/* Submit Button */}
        <Button
          data-testid="button-submit"
          onClick={handleSubmit}
          disabled={!canContinue}
          className="w-full rounded-full bg-primary hover:bg-primary/20 text-white transition-colors min-h-[48px]"
          size="lg"
        >
          Authorize Background Check
        </Button>
      </div>
    </div>
  );
}
