import { Heart, MessageCircle, User, BookOpen, Settings, Shield, Award, Upload, X, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState } from "react";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingAttributes, setIsEditingAttributes] = useState(false);
  
  // Get data from sessionStorage (will be replaced with real user data)
  const userName = sessionStorage.getItem('userName') || "User";
  const userRole = sessionStorage.getItem('userRole') || "Dominant";
  const userId = sessionStorage.getItem('userId');
  const personalityType = "Caring Guide";
  const relationshipStyle = "Committed Partnership Builder";

  // Physical attributes state
  const [height, setHeight] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [nationality, setNationality] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyShape, setBodyShape] = useState("");

  // Fetch user data including images
  const { data: userData } = useQuery({
    queryKey: ['/api/users', userId],
    queryFn: async () => {
      if (!userId) return null;
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      const data = await res.json();
      // Initialize physical attributes from user data
      setHeight(data.height || "");
      setEyeColor(data.eyeColor || "");
      setHairColor(data.hairColor || "");
      setNationality(data.nationality || "");
      setWeight(data.weight || "");
      setBodyShape(data.bodyShape || "");
      return data;
    },
    enabled: Boolean(userId)
  });

  const profileImages = (userData?.profileImages || []) as string[];

  // Update attributes mutation
  const updateAttributesMutation = useMutation({
    mutationFn: async (attributes: {
      height?: string;
      eyeColor?: string;
      hairColor?: string;
      nationality?: string;
      weight?: string;
      bodyShape?: string;
    }) => {
      const res = await apiRequest('PATCH', `/api/users/${userId}`, attributes);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      setIsEditingAttributes(false);
      toast({
        title: "Success",
        description: "Physical attributes updated successfully"
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update attributes"
      });
    }
  });

  const handleSaveAttributes = () => {
    updateAttributesMutation.mutate({
      height,
      eyeColor,
      hairColor,
      nationality,
      weight,
      bodyShape
    });
  };

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const res = await fetch(`/api/users/${userId}/images`, {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to upload image');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      toast({
        title: "Success",
        description: "Image uploaded successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message
      });
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (imageUrl: string) => {
      const res = await fetch(`/api/users/${userId}/images`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      });
      
      if (!res.ok) throw new Error('Failed to delete image');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      toast({
        title: "Success",
        description: "Image deleted successfully"
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete image"
      });
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Image must be less than 5MB"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload an image file"
      });
      return;
    }

    uploadMutation.mutate(file);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col pb-20">
        {/* Header */}
        <div className="p-4 border-b border-border bg-background flex justify-between items-center">
          <h2 className="text-2xl font-light text-foreground">Profile</h2>
          <button
            data-testid="button-settings"
            onClick={() => setLocation("/settings")}
            className="text-foreground/70 hover-elevate active-elevate-2 p-2 rounded-md"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Profile Header */}
          <div className="text-center mb-6">
            <Avatar className="w-24 h-24 mx-auto mb-3">
              <AvatarFallback className="text-3xl">{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-2xl font-light text-foreground" data-testid="text-profile-name">
              {userName}
            </h3>
            <p className="text-primary font-medium" data-testid="text-profile-role">
              {userRole}
            </p>
          </div>

          {/* Profile Images Section */}
          <Card className="p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">Profile Photos</h4>
              <span className="text-sm text-muted-foreground">
                {profileImages.length}/6
              </span>
            </div>
            
            {profileImages.length === 0 && (
              <div className="text-center py-8 bg-muted rounded-lg mb-3">
                <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Upload at least 1 face photo
                </p>
              </div>
            )}

            {/* Image Grid */}
            {profileImages.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mb-3">
                {profileImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-square bg-muted rounded-lg overflow-hidden group"
                    data-testid={`image-slot-${index}`}
                  >
                    <img
                      src={imageUrl}
                      alt={`Profile ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      data-testid={`button-delete-image-${index}`}
                      onClick={() => deleteMutation.mutate(imageUrl)}
                      disabled={deleteMutation.isPending}
                      className="absolute top-1 right-1 bg-destructive/90 text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Primary
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {profileImages.length < 6 && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                  data-testid="input-file"
                />
                <Button
                  data-testid="button-upload-image"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadMutation.isPending || deleteMutation.isPending}
                  variant="outline"
                  className="w-full"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploadMutation.isPending ? 'Uploading...' : 'Add Photo'}
                </Button>
              </>
            )}

            {profileImages.length === 0 && (
              <p className="text-xs text-muted-foreground mt-2">
                At least 1 face photo is required. Max 6 photos.
              </p>
            )}
          </Card>

          {/* Verification Status */}
          {userRole === 'Dominant' && (
            <Card className="p-4 mb-4 bg-green-500/10 border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                <h4 className="font-medium text-green-600 dark:text-green-400">Verified Dom</h4>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Escrow account active and verified
              </p>
            </Card>
          )}

          {/* Assessment Results */}
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-5 h-5 text-primary" />
              <h4 className="font-medium text-foreground">Assessment Results</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Personality Type</span>
                <span className="font-medium text-foreground" data-testid="text-profile-personality">
                  {personalityType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Relationship Style</span>
                <span className="font-medium text-foreground" data-testid="text-profile-relationship">
                  {relationshipStyle}
                </span>
              </div>
            </div>
          </Card>

          {/* Physical Attributes */}
          <Card className="p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <UserCircle className="w-5 h-5 text-primary" />
                <h4 className="font-medium text-foreground">Physical Attributes</h4>
              </div>
              {!isEditingAttributes && (
                <Button
                  data-testid="button-edit-attributes"
                  onClick={() => setIsEditingAttributes(true)}
                  variant="ghost"
                  size="sm"
                >
                  Edit
                </Button>
              )}
            </div>
            
            {isEditingAttributes ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="height" className="text-sm text-muted-foreground">Height</Label>
                  <Input
                    id="height"
                    data-testid="input-height"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g., 5'10&quot; or 178cm"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="weight" className="text-sm text-muted-foreground">Weight</Label>
                  <Input
                    id="weight"
                    data-testid="input-weight"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g., 170 lbs or 77 kg"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="bodyShape" className="text-sm text-muted-foreground">Body Shape</Label>
                  <Input
                    id="bodyShape"
                    data-testid="input-body-shape"
                    value={bodyShape}
                    onChange={(e) => setBodyShape(e.target.value)}
                    placeholder="e.g., Athletic, Curvy, Slim"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="eyeColor" className="text-sm text-muted-foreground">Eye Color</Label>
                  <Input
                    id="eyeColor"
                    data-testid="input-eye-color"
                    value={eyeColor}
                    onChange={(e) => setEyeColor(e.target.value)}
                    placeholder="e.g., Brown, Blue, Green"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="hairColor" className="text-sm text-muted-foreground">Hair Color</Label>
                  <Input
                    id="hairColor"
                    data-testid="input-hair-color"
                    value={hairColor}
                    onChange={(e) => setHairColor(e.target.value)}
                    placeholder="e.g., Blonde, Black, Brown"
                    className="rounded-xl"
                  />
                </div>
                <div>
                  <Label htmlFor="nationality" className="text-sm text-muted-foreground">Nationality</Label>
                  <Input
                    id="nationality"
                    data-testid="input-nationality"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    placeholder="e.g., American, British"
                    className="rounded-xl"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    data-testid="button-save-attributes"
                    onClick={handleSaveAttributes}
                    disabled={updateAttributesMutation.isPending}
                    className="flex-1 rounded-full bg-red-500 hover:bg-black text-white transition-colors"
                  >
                    {updateAttributesMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    data-testid="button-cancel-attributes"
                    onClick={() => {
                      setIsEditingAttributes(false);
                      // Reset to original values
                      setHeight(userData?.height || "");
                      setEyeColor(userData?.eyeColor || "");
                      setHairColor(userData?.hairColor || "");
                      setNationality(userData?.nationality || "");
                      setWeight(userData?.weight || "");
                      setBodyShape(userData?.bodyShape || "");
                    }}
                    variant="outline"
                    className="flex-1 rounded-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Height</span>
                  <span className="font-medium text-foreground" data-testid="text-height">
                    {height || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="font-medium text-foreground" data-testid="text-weight">
                    {weight || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Body Shape</span>
                  <span className="font-medium text-foreground" data-testid="text-body-shape">
                    {bodyShape || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Eye Color</span>
                  <span className="font-medium text-foreground" data-testid="text-eye-color">
                    {eyeColor || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hair Color</span>
                  <span className="font-medium text-foreground" data-testid="text-hair-color">
                    {hairColor || 'Not set'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nationality</span>
                  <span className="font-medium text-foreground" data-testid="text-nationality">
                    {nationality || 'Not set'}
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Card className="p-3 text-center">
              <div className="text-2xl font-light text-foreground mb-1">0</div>
              <div className="text-xs text-muted-foreground">Matches</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-light text-foreground mb-1">0</div>
              <div className="text-xs text-muted-foreground">Likes Sent</div>
            </Card>
            <Card className="p-3 text-center">
              <div className="text-2xl font-light text-foreground mb-1">95%</div>
              <div className="text-xs text-muted-foreground">Avg Match</div>
            </Card>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              data-testid="button-edit-profile"
              variant="outline"
              className="w-full rounded-xl"
            >
              Edit Profile
            </Button>
            <Button
              data-testid="button-retake-tests"
              variant="outline"
              className="w-full rounded-xl"
            >
              Retake Assessments
            </Button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <nav className="bg-background p-4 flex justify-around border-t border-border fixed bottom-0 left-0 right-0 max-w-md mx-auto">
          <button
            data-testid="nav-discover"
            onClick={() => setLocation("/discover")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <Heart className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-education"
            onClick={() => setLocation("/learn")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <BookOpen className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-messages"
            onClick={() => setLocation("/messages")}
            className="text-muted-foreground p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <MessageCircle className="w-6 h-6" />
          </button>
          <button
            data-testid="nav-profile"
            className="text-primary p-2 hover-elevate active-elevate-2 rounded-md"
          >
            <User className="w-6 h-6" />
          </button>
        </nav>
      </div>
    </div>
  );
}
