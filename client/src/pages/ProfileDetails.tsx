import { useState } from "react";
import { ChevronLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function ProfileDetails() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showErrors, setShowErrors] = useState(false);

  // Get user ID from session
  const userId = sessionStorage.getItem('userId');

  // Calculate age from verification data
  const calculateAge = () => {
    const month = sessionStorage.getItem('verificationMonth');
    const day = sessionStorage.getItem('verificationDay');
    const year = sessionStorage.getItem('verificationYear');
    
    if (!month || !day || !year) return "";
    
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age.toString();
  };

  // Get prefilled data from verification/background check
  const prefilledCity = sessionStorage.getItem('backgroundCheckCity') || "";
  const prefilledState = sessionStorage.getItem('backgroundCheckState') || "";
  const prefilledAge = calculateAge();

  // Physical attributes
  const [age, setAge] = useState(prefilledAge);
  const [sex, setSex] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [race, setRace] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [hairColor, setHairColor] = useState("");

  // Location
  const [city, setCity] = useState(prefilledCity);
  const [state, setState] = useState(prefilledState);

  // Lifestyle
  const [profession, setProfession] = useState("");
  const [drinking, setDrinking] = useState("");
  const [smoking, setSmoking] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("");

  // Relationship preferences
  const [experienceLevel, setExperienceLevel] = useState("");
  const [sexualOrientation, setSexualOrientation] = useState("");

  const updateProfileMutation = useMutation({
    mutationFn: async (profileData: any) => {
      const res = await apiRequest("PATCH", `/api/users/${userId}`, profileData);
      return await res.json();
    },
    onSuccess: () => {
      setLocation("/personality-test");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const canContinue = 
    age && sex && heightFeet && heightInches && bodyType && 
    race && eyeColor && hairColor && city && state && 
    profession && drinking && smoking && fitnessLevel && 
    experienceLevel && sexualOrientation;

  const handleContinue = () => {
    if (!canContinue) {
      setShowErrors(true);
      toast({
        title: "Incomplete Profile",
        description: "Please fill in all required fields marked in red",
        variant: "destructive",
      });
      // Scroll to top to see errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const height = `${heightFeet}'${heightInches}"`;
    updateProfileMutation.mutate({
      age: parseInt(age),
      sex,
      height,
      weight: weight || null,
      bodyType,
      race,
      eyeColor,
      hairColor,
      city,
      state,
      profession,
      drinking,
      smoking,
      fitnessLevel,
      experienceLevel,
      sexualOrientation,
    });
  };

  // Helper to add error styling
  const getFieldClassName = (isValid: boolean, baseClass: string = "rounded-xl") => {
    return `${baseClass} ${showErrors && !isValid ? 'border-red-500 border-2' : ''}`;
  };

  // Helper for error message
  const ErrorMessage = ({ show, message }: { show: boolean; message: string }) => {
    if (!show) return null;
    return <p className="text-xs text-red-500 mt-1">{message}</p>;
  };

  // Helper for required asterisk
  const RequiredMark = ({ show }: { show: boolean }) => {
    if (!show) return null;
    return <span className="text-red-500">*</span>;
  };

  return (
    <div className="min-h-screen bg-muted p-6">
      <button
        data-testid="button-back"
        onClick={() => setLocation("/signup")}
        className="mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center mb-2">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-black flex items-center justify-center">
            <User className="w-6 h-6 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">Complete Your Profile</h2>
        <p className="text-muted-foreground mb-8 text-center">Help us find your perfect match</p>

        {showErrors && !canContinue && (
          <Card className="p-4 mb-6 bg-red-500/10 border-red-500/30">
            <p className="text-sm font-medium text-red-700 dark:text-red-400 text-center">
              ⚠️ Please complete all required fields below (marked with *)
            </p>
          </Card>
        )}

        <div className="space-y-6">
          {/* Physical Attributes */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Physical Attributes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age" className="text-foreground mb-2 block">
                  Age <RequiredMark show={showErrors && !age} />
                </Label>
                <Input
                  data-testid="input-age"
                  id="age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={getFieldClassName(!!age)}
                  min="21"
                  max="99"
                />
                <ErrorMessage show={showErrors && !age} message="Age is required" />
              </div>

              <div>
                <Label htmlFor="sex" className="text-foreground mb-2 block">
                  Sex <RequiredMark show={showErrors && !sex} />
                </Label>
                <Select value={sex} onValueChange={setSex}>
                  <SelectTrigger data-testid="select-sex" id="sex" className={getFieldClassName(!!sex)}>
                    <SelectValue placeholder="Select sex" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Non-binary">Non-binary</SelectItem>
                    <SelectItem value="Transgender Male">Transgender Male</SelectItem>
                    <SelectItem value="Transgender Female">Transgender Female</SelectItem>
                    <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage show={showErrors && !sex} message="Sex is required" />
              </div>

              <div>
                <Label className="text-foreground mb-2 block">
                  Height <RequiredMark show={showErrors && (!heightFeet || !heightInches)} />
                </Label>
                <div className="flex gap-2">
                  <Input
                    data-testid="input-height-feet"
                    type="number"
                    placeholder="5"
                    value={heightFeet}
                    onChange={(e) => setHeightFeet(e.target.value)}
                    className={getFieldClassName(!!heightFeet)}
                    min="3"
                    max="8"
                  />
                  <span className="flex items-center text-muted-foreground">ft</span>
                  <Input
                    data-testid="input-height-inches"
                    type="number"
                    placeholder="10"
                    value={heightInches}
                    onChange={(e) => setHeightInches(e.target.value)}
                    className={getFieldClassName(!!heightInches)}
                    min="0"
                    max="11"
                  />
                  <span className="flex items-center text-muted-foreground">in</span>
                </div>
                <ErrorMessage show={showErrors && (!heightFeet || !heightInches)} message="Both feet and inches are required" />
              </div>

              <div>
                <Label htmlFor="weight" className="text-foreground mb-2 block">Weight</Label>
                <div className="flex gap-2">
                  <Input
                    data-testid="input-weight"
                    id="weight"
                    type="number"
                    placeholder="150"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="rounded-xl"
                  />
                  <span className="flex items-center text-muted-foreground">lbs</span>
                </div>
              </div>

              <div>
                <Label htmlFor="bodyType" className="text-foreground mb-2 block">
                  Body Type <RequiredMark show={showErrors && !bodyType} />
                </Label>
                <Select value={bodyType} onValueChange={setBodyType}>
                  <SelectTrigger data-testid="select-body-type" id="bodyType" className={getFieldClassName(!!bodyType)}>
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Slim">Slim</SelectItem>
                    <SelectItem value="Athletic">Athletic</SelectItem>
                    <SelectItem value="Average">Average</SelectItem>
                    <SelectItem value="Curvy">Curvy</SelectItem>
                    <SelectItem value="Muscular">Muscular</SelectItem>
                    <SelectItem value="Plus-size">Plus-size</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage show={showErrors && !bodyType} message="Body type is required" />
              </div>

              <div>
                <Label htmlFor="race" className="text-foreground mb-2 block">
                  Race/Ethnicity <RequiredMark show={showErrors && !race} />
                </Label>
                <Select value={race} onValueChange={setRace}>
                  <SelectTrigger data-testid="select-race" id="race" className={getFieldClassName(!!race)}>
                    <SelectValue placeholder="Select race" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Asian">Asian</SelectItem>
                    <SelectItem value="Black/African American">Black/African American</SelectItem>
                    <SelectItem value="Hispanic/Latino">Hispanic/Latino</SelectItem>
                    <SelectItem value="Middle Eastern">Middle Eastern</SelectItem>
                    <SelectItem value="Native American">Native American</SelectItem>
                    <SelectItem value="Pacific Islander">Pacific Islander</SelectItem>
                    <SelectItem value="White/Caucasian">White/Caucasian</SelectItem>
                    <SelectItem value="Mixed/Multi-racial">Mixed/Multi-racial</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage show={showErrors && !race} message="Race/ethnicity is required" />
              </div>

              <div>
                <Label htmlFor="eyeColor" className="text-foreground mb-2 block">
                  Eye Color <RequiredMark show={showErrors && !eyeColor} />
                </Label>
                <Select value={eyeColor} onValueChange={setEyeColor}>
                  <SelectTrigger data-testid="select-eye-color" id="eyeColor" className={getFieldClassName(!!eyeColor)}>
                    <SelectValue placeholder="Select eye color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Blue">Blue</SelectItem>
                    <SelectItem value="Brown">Brown</SelectItem>
                    <SelectItem value="Green">Green</SelectItem>
                    <SelectItem value="Hazel">Hazel</SelectItem>
                    <SelectItem value="Gray">Gray</SelectItem>
                    <SelectItem value="Amber">Amber</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage show={showErrors && !eyeColor} message="Eye color is required" />
              </div>

              <div>
                <Label htmlFor="hairColor" className="text-foreground mb-2 block">
                  Hair Color <RequiredMark show={showErrors && !hairColor} />
                </Label>
                <Select value={hairColor} onValueChange={setHairColor}>
                  <SelectTrigger data-testid="select-hair-color" id="hairColor" className={getFieldClassName(!!hairColor)}>
                    <SelectValue placeholder="Select hair color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Black">Black</SelectItem>
                    <SelectItem value="Brown">Brown</SelectItem>
                    <SelectItem value="Blonde">Blonde</SelectItem>
                    <SelectItem value="Red">Red</SelectItem>
                    <SelectItem value="Gray/White">Gray/White</SelectItem>
                    <SelectItem value="Auburn">Auburn</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage show={showErrors && !hairColor} message="Hair color is required" />
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city" className="text-foreground mb-2 block">
                  City <RequiredMark show={showErrors && !city} />
                </Label>
                <Input
                  data-testid="input-city"
                  id="city"
                  type="text"
                  placeholder="New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={getFieldClassName(!!city)}
                />
                <ErrorMessage show={showErrors && !city} message="City is required" />
              </div>

              <div>
                <Label htmlFor="state" className="text-foreground mb-2 block">
                  State <RequiredMark show={showErrors && !state} />
                </Label>
                <Input
                  data-testid="input-state"
                  id="state"
                  type="text"
                  placeholder="NY"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className={getFieldClassName(!!state)}
                  maxLength={2}
                />
                <ErrorMessage show={showErrors && !state} message="State is required" />
              </div>
            </div>
          </Card>

          {/* Lifestyle */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Lifestyle</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profession" className="text-foreground mb-2 block">
                  Profession <RequiredMark show={showErrors && !profession} />
                </Label>
                <Select value={profession} onValueChange={setProfession}>
                  <SelectTrigger data-testid="select-profession" id="profession" className={getFieldClassName(!!profession)}>
                    <SelectValue placeholder="Select profession" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Executive/Management">Executive/Management</SelectItem>
                    <SelectItem value="Finance/Banking">Finance/Banking</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Legal">Legal</SelectItem>
                    <SelectItem value="Education">Education</SelectItem>
                    <SelectItem value="Creative/Arts">Creative/Arts</SelectItem>
                    <SelectItem value="Entrepreneur">Entrepreneur</SelectItem>
                    <SelectItem value="Sales/Marketing">Sales/Marketing</SelectItem>
                    <SelectItem value="Other Professional">Other Professional</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage show={showErrors && !profession} message="Profession is required" />
              </div>

              <div>
                <Label htmlFor="drinking" className="text-foreground mb-2 block">
                  Drinking <RequiredMark show={showErrors && !drinking} />
                </Label>
                <Select value={drinking} onValueChange={setDrinking}>
                  <SelectTrigger data-testid="select-drinking" id="drinking" className={getFieldClassName(!!drinking)}>
                    <SelectValue placeholder="Select drinking habits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Never">Never</SelectItem>
                    <SelectItem value="Rarely">Rarely</SelectItem>
                    <SelectItem value="Socially">Socially</SelectItem>
                    <SelectItem value="Regularly">Regularly</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage show={showErrors && !drinking} message="Drinking habits are required" />
              </div>

              <div>
                <Label htmlFor="smoking" className="text-foreground mb-2 block">
                  Smoking <RequiredMark show={showErrors && !smoking} />
                </Label>
                <Select value={smoking} onValueChange={setSmoking}>
                  <SelectTrigger data-testid="select-smoking" id="smoking" className={getFieldClassName(!!smoking)}>
                    <SelectValue placeholder="Select smoking habits" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Never">Never</SelectItem>
                    <SelectItem value="Rarely">Rarely</SelectItem>
                    <SelectItem value="Socially">Socially</SelectItem>
                    <SelectItem value="Regularly">Regularly</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage show={showErrors && !smoking} message="Smoking habits are required" />
              </div>

              <div>
                <Label htmlFor="fitnessLevel" className="text-foreground mb-2 block">
                  Fitness Level <RequiredMark show={showErrors && !fitnessLevel} />
                </Label>
                <Select value={fitnessLevel} onValueChange={setFitnessLevel}>
                  <SelectTrigger data-testid="select-fitness" id="fitnessLevel" className={getFieldClassName(!!fitnessLevel)}>
                    <SelectValue placeholder="Select fitness level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sedentary">Sedentary</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Very Active">Very Active</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage show={showErrors && !fitnessLevel} message="Fitness level is required" />
              </div>
            </div>
          </Card>

          {/* Relationship Preferences */}
          <Card className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-4">Relationship Preferences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="experienceLevel" className="text-foreground mb-2 block">
                  BDSM Experience <RequiredMark show={showErrors && !experienceLevel} />
                </Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger data-testid="select-experience" id="experienceLevel" className={getFieldClassName(!!experienceLevel)}>
                    <SelectValue placeholder="Your experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Beginner</SelectItem>
                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                    <SelectItem value="Advanced">Advanced</SelectItem>
                    <SelectItem value="Expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage show={showErrors && !experienceLevel} message="Experience level is required" />
              </div>

              <div>
                <Label htmlFor="sexualOrientation" className="text-foreground mb-2 block">
                  Sexual Orientation <RequiredMark show={showErrors && !sexualOrientation} />
                </Label>
                <Select value={sexualOrientation} onValueChange={setSexualOrientation}>
                  <SelectTrigger data-testid="select-orientation" id="sexualOrientation" className={getFieldClassName(!!sexualOrientation)}>
                    <SelectValue placeholder="Select orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Heterosexual">Heterosexual</SelectItem>
                    <SelectItem value="Homosexual">Homosexual</SelectItem>
                    <SelectItem value="Bisexual">Bisexual</SelectItem>
                    <SelectItem value="Pansexual">Pansexual</SelectItem>
                    <SelectItem value="Asexual">Asexual</SelectItem>
                    <SelectItem value="Questioning">Questioning</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage show={showErrors && !sexualOrientation} message="Sexual orientation is required" />
              </div>
            </div>
          </Card>

          <div className="flex flex-col items-center gap-3 pt-4">
            <Button
              data-testid="button-continue"
              onClick={handleContinue}
              disabled={updateProfileMutation.isPending}
              className="rounded-full bg-primary hover:bg-primary/20 text-white transition-colors px-12"
              size="lg"
            >
              {updateProfileMutation.isPending ? "Saving..." : "Continue"}
            </Button>
            
            {showErrors && !canContinue && (
              <p className="text-center text-sm text-red-500">
                ⚠️ {16 - [age, sex, heightFeet, heightInches, bodyType, race, eyeColor, hairColor, city, state, profession, drinking, smoking, fitnessLevel, experienceLevel, sexualOrientation].filter(Boolean).length} fields still need to be completed
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
