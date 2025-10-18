import { Heart, MessageCircle, User, BookOpen, Settings, Shield, Award, Upload, X, UserCircle, FileText, Pencil, Edit2, MapPin, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useRef, useState } from "react";

export default function Profile() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editFileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const [isEditingAttributes, setIsEditingAttributes] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
  
  // Get data from sessionStorage (will be replaced with real user data)
  const userName = localStorage.getItem('userName') || "User";
  const userRole = localStorage.getItem('userRole') || "Dominant";
  const userId = localStorage.getItem('userId');
  const personalityType = "Caring Guide";
  const relationshipStyle = "Committed Partnership Builder";

  // Physical attributes state
  const [height, setHeight] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [nationality, setNationality] = useState("");
  const [weight, setWeight] = useState("");
  const [bodyShape, setBodyShape] = useState("");
  
  // Bio state
  const [bio, setBio] = useState("");

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
      setBio(data.bio || "");
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

  // Bio mutation
  const updateBioMutation = useMutation({
    mutationFn: async (bioText: string) => {
      const res = await apiRequest('PATCH', `/api/users/${userId}`, { bio: bioText });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      setIsEditingBio(false);
      toast({
        title: "Success",
        description: "Bio updated successfully"
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update bio"
      });
    }
  });

  const handleSaveBio = () => {
    // Count words
    const wordCount = bio.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    if (wordCount > 500) {
      toast({
        variant: "destructive",
        title: "Word limit exceeded",
        description: `Your bio has ${wordCount} words. Please keep it under 500 words.`
      });
      return;
    }
    
    updateBioMutation.mutate(bio);
  };

  // Helper to count words
  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
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

  // Set primary image mutation
  const setPrimaryMutation = useMutation({
    mutationFn: async (imageUrl: string) => {
      // Reorder the images array to put selected image first
      const reorderedImages = [imageUrl, ...profileImages.filter(url => url !== imageUrl)];
      
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImages: reorderedImages })
      });
      
      if (!res.ok) throw new Error('Failed to set primary photo');
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      toast({
        title: "Success",
        description: "Primary photo updated"
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set primary photo"
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

  // Replace mutation for editing existing images
  const replaceMutation = useMutation({
    mutationFn: async ({ file, oldImageUrl }: { file: File; oldImageUrl: string }) => {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('oldImageUrl', oldImageUrl);
      
      const res = await fetch(`/api/users/${userId}/images/replace`, {
        method: 'POST',
        body: formData
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to replace image');
      }
      
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      setEditingImageIndex(null);
      toast({
        title: "Success",
        description: "Image replaced successfully"
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Replace failed",
        description: error.message
      });
    }
  });

  const handleEditImage = (index: number) => {
    setEditingImageIndex(index);
    editFileInputRefs.current[index]?.click();
  };

  const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>, imageUrl: string) => {
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

    replaceMutation.mutate({ file, oldImageUrl: imageUrl });
    
    // Reset input
    const index = editingImageIndex;
    if (index !== null && editFileInputRefs.current[index]) {
      editFileInputRefs.current[index]!.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="max-w-md mx-auto w-full flex flex-col pb-20">
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-border bg-background flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-light text-foreground">Profile</h2>
          <button
            data-testid="button-settings"
            onClick={() => setLocation("/settings")}
            className="text-foreground/70 hover-elevate active-elevate-2 p-2 rounded-md min-w-[44px] min-h-[44px] flex items-center justify-center"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 sm:p-4">
          {/* Profile Header */}
          <div className="text-center mb-4 sm:mb-6">
            <Avatar className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3">
              {profileImages.length > 0 && (
                <AvatarImage src={profileImages[0]} alt={userName} className="object-cover" />
              )}
              <AvatarFallback className="text-2xl sm:text-3xl">{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl sm:text-2xl font-light text-foreground" data-testid="text-profile-name">
              {userData?.profileName || userName}
            </h3>
            <p className="text-primary font-medium text-sm sm:text-base" data-testid="text-profile-role">
              {userRole}
            </p>
          </div>

          {/* Profile Name Card */}
          <Card 
            className="p-4 mb-4 hover-elevate active-elevate-2 cursor-pointer"
            onClick={() => setLocation("/profile-name")}
            data-testid="card-profile-name"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <UserCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Profile Name</h4>
                  <p className="text-sm text-muted-foreground">
                    {userData?.profileName || "Set your profile name"}
                  </p>
                </div>
              </div>
              <Edit2 className="w-5 h-5 text-muted-foreground" />
            </div>
          </Card>

          {/* Profile Images Section */}
          <Card className="p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-foreground">Profile Photos</h4>
              <span className="text-sm text-muted-foreground">
                {profileImages.length}/5
              </span>
            </div>
            
            <div className="mb-3 p-3 bg-muted/50 rounded-lg border border-border">
              <p className="text-xs text-foreground font-medium mb-2">Photo Guidelines:</p>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Face photos are <span className="font-medium text-foreground">not required</span></li>
                <li>• Choose photos in good lighting</li>
                <li>• Show yourself active outdoors</li>
                <li>• Include social settings or events</li>
                <li>• Lifestyle photos that represent you</li>
              </ul>
            </div>
            
            {profileImages.length === 0 && (
              <div className="text-center py-8 bg-muted rounded-lg mb-3">
                <Upload className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Upload up to 5 lifestyle photos
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Face photos optional
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
                    <input
                      ref={(el) => editFileInputRefs.current[index] = el}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleEditFileSelect(e, imageUrl)}
                      className="hidden"
                      data-testid={`input-edit-file-${index}`}
                    />
                    <div className="absolute top-1 right-1 flex gap-1">
                      <button
                        data-testid={`button-edit-image-${index}`}
                        onClick={() => handleEditImage(index)}
                        disabled={replaceMutation.isPending || deleteMutation.isPending || setPrimaryMutation.isPending}
                        className="bg-primary/90 text-primary-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        data-testid={`button-delete-image-${index}`}
                        onClick={() => deleteMutation.mutate(imageUrl)}
                        disabled={deleteMutation.isPending || replaceMutation.isPending || setPrimaryMutation.isPending}
                        className="bg-destructive/90 text-destructive-foreground p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    {index === 0 ? (
                      <div className="absolute bottom-1 left-1 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Primary
                      </div>
                    ) : (
                      <button
                        data-testid={`button-set-primary-${index}`}
                        onClick={() => setPrimaryMutation.mutate(imageUrl)}
                        disabled={setPrimaryMutation.isPending || deleteMutation.isPending || replaceMutation.isPending}
                        className="absolute bottom-1 left-1 bg-blue-500/90 hover:bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Set as Primary
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {profileImages.length < 5 && (
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
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Upload photos that showcase your lifestyle. Maximum 5 photos.
              </p>
            )}
          </Card>

          {/* Bio Section */}
          <Card className="p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h4 className="font-medium text-foreground">About Me</h4>
              </div>
              {!isEditingBio && (
                <Button
                  data-testid="button-edit-bio"
                  onClick={() => setIsEditingBio(true)}
                  variant="ghost"
                  size="sm"
                >
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
            
            {isEditingBio ? (
              <div className="space-y-3">
                <div>
                  <Textarea
                    data-testid="input-bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell potential matches about yourself... (500 word limit)"
                    className="min-h-[150px] rounded-xl resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-muted-foreground">
                      {getWordCount(bio)} / 500 words
                    </p>
                    {getWordCount(bio) > 500 && (
                      <p className="text-xs text-destructive">
                        Exceeds word limit
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    data-testid="button-save-bio"
                    onClick={handleSaveBio}
                    disabled={updateBioMutation.isPending}
                    className="flex-1 rounded-full bg-primary hover:bg-primary/20 text-white transition-colors"
                  >
                    {updateBioMutation.isPending ? 'Saving...' : 'Save'}
                  </Button>
                  <Button
                    data-testid="button-cancel-bio"
                    onClick={() => {
                      setIsEditingBio(false);
                      setBio(userData?.bio || "");
                    }}
                    variant="outline"
                    className="flex-1 rounded-full"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div>
                {bio ? (
                  <p className="text-sm text-foreground whitespace-pre-wrap" data-testid="text-bio">
                    {bio}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground italic" data-testid="text-bio-empty">
                    No bio added yet. Tell others about yourself.
                  </p>
                )}
              </div>
            )}
          </Card>

          {/* Travel Mode */}
          <Card 
            className="p-4 mb-4 hover-elevate active-elevate-2 cursor-pointer"
            onClick={() => setLocation("/travel-mode")}
            data-testid="card-travel-mode"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plane className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground">Travel Mode</h4>
                  {localStorage.getItem('isTraveling') === 'true' ? (
                    <p className="text-sm text-primary flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {localStorage.getItem('travelLocation')}
                    </p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Match in other cities
                    </p>
                  )}
                </div>
              </div>
              <div>
                {localStorage.getItem('isTraveling') === 'true' ? (
                  <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                    Active
                  </span>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground"
                  >
                    Set Location
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Verification Status */}
          {userRole === 'Dominant' && userData?.escrowVerified && userData?.fullyFunded && (
            <Card className="p-4 mb-4 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/20">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-amber-500 to-yellow-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-700 dark:text-amber-400">Verified & Fully Funded</h4>
                  <p className="text-xs text-amber-700/80 dark:text-amber-400/80">Premium verification status</p>
                </div>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                You have completed escrow/mutual fund verification with full funding. This premium badge is displayed on your profile to demonstrate maximum commitment and trustworthiness.
              </p>
            </Card>
          )}
          {userRole === 'Dominant' && userData?.verified && !userData?.fullyFunded && (
            <Card className="p-4 mb-4 bg-green-500/10 border-green-500/20">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                <h4 className="font-medium text-green-600 dark:text-green-400">Verified Dom</h4>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                Account verified with active escrow
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

          {/* Important Traits */}
          <Card className="p-4 mb-4 hover-elevate active-elevate-2 cursor-pointer" onClick={() => setLocation("/important-traits")}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" />
                <h4 className="font-medium text-foreground">Things Important to Me</h4>
              </div>
              <Button
                data-testid="button-edit-traits"
                variant="ghost"
                size="sm"
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {userData?.importantTraits && userData.importantTraits.length > 0 
                ? `${userData.importantTraits.length} traits selected`
                : "Select the values that matter most to you"}
            </p>
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
                  <Pencil className="w-4 h-4 mr-1" />
                  Edit
                </Button>
              )}
            </div>
            
            {isEditingAttributes ? (
              <div className="space-y-3">
                <div>
                  <Label htmlFor="height" className="text-sm text-muted-foreground">Height</Label>
                  <Select value={height} onValueChange={setHeight}>
                    <SelectTrigger className="rounded-xl" data-testid="select-height">
                      <SelectValue placeholder="Select height" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="4'10&quot; (147cm)">4'10" (147cm)</SelectItem>
                      <SelectItem value="4'11&quot; (150cm)">4'11" (150cm)</SelectItem>
                      <SelectItem value="5'0&quot; (152cm)">5'0" (152cm)</SelectItem>
                      <SelectItem value="5'1&quot; (155cm)">5'1" (155cm)</SelectItem>
                      <SelectItem value="5'2&quot; (157cm)">5'2" (157cm)</SelectItem>
                      <SelectItem value="5'3&quot; (160cm)">5'3" (160cm)</SelectItem>
                      <SelectItem value="5'4&quot; (163cm)">5'4" (163cm)</SelectItem>
                      <SelectItem value="5'5&quot; (165cm)">5'5" (165cm)</SelectItem>
                      <SelectItem value="5'6&quot; (168cm)">5'6" (168cm)</SelectItem>
                      <SelectItem value="5'7&quot; (170cm)">5'7" (170cm)</SelectItem>
                      <SelectItem value="5'8&quot; (173cm)">5'8" (173cm)</SelectItem>
                      <SelectItem value="5'9&quot; (175cm)">5'9" (175cm)</SelectItem>
                      <SelectItem value="5'10&quot; (178cm)">5'10" (178cm)</SelectItem>
                      <SelectItem value="5'11&quot; (180cm)">5'11" (180cm)</SelectItem>
                      <SelectItem value="6'0&quot; (183cm)">6'0" (183cm)</SelectItem>
                      <SelectItem value="6'1&quot; (185cm)">6'1" (185cm)</SelectItem>
                      <SelectItem value="6'2&quot; (188cm)">6'2" (188cm)</SelectItem>
                      <SelectItem value="6'3&quot; (191cm)">6'3" (191cm)</SelectItem>
                      <SelectItem value="6'4&quot; (193cm)">6'4" (193cm)</SelectItem>
                      <SelectItem value="6'5&quot; (196cm)">6'5" (196cm)</SelectItem>
                      <SelectItem value="6'6&quot; (198cm)">6'6" (198cm)</SelectItem>
                      <SelectItem value="6'7&quot; (201cm)">6'7" (201cm)</SelectItem>
                      <SelectItem value="6'8&quot; (203cm)">6'8" (203cm)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="weight" className="text-sm text-muted-foreground">Weight</Label>
                  <Select value={weight} onValueChange={setWeight}>
                    <SelectTrigger className="rounded-xl" data-testid="select-weight">
                      <SelectValue placeholder="Select weight" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="90-100 lbs (41-45 kg)">90-100 lbs (41-45 kg)</SelectItem>
                      <SelectItem value="100-110 lbs (45-50 kg)">100-110 lbs (45-50 kg)</SelectItem>
                      <SelectItem value="110-120 lbs (50-54 kg)">110-120 lbs (50-54 kg)</SelectItem>
                      <SelectItem value="120-130 lbs (54-59 kg)">120-130 lbs (54-59 kg)</SelectItem>
                      <SelectItem value="130-140 lbs (59-64 kg)">130-140 lbs (59-64 kg)</SelectItem>
                      <SelectItem value="140-150 lbs (64-68 kg)">140-150 lbs (64-68 kg)</SelectItem>
                      <SelectItem value="150-160 lbs (68-73 kg)">150-160 lbs (68-73 kg)</SelectItem>
                      <SelectItem value="160-170 lbs (73-77 kg)">160-170 lbs (73-77 kg)</SelectItem>
                      <SelectItem value="170-180 lbs (77-82 kg)">170-180 lbs (77-82 kg)</SelectItem>
                      <SelectItem value="180-190 lbs (82-86 kg)">180-190 lbs (82-86 kg)</SelectItem>
                      <SelectItem value="190-200 lbs (86-91 kg)">190-200 lbs (86-91 kg)</SelectItem>
                      <SelectItem value="200-210 lbs (91-95 kg)">200-210 lbs (91-95 kg)</SelectItem>
                      <SelectItem value="210-220 lbs (95-100 kg)">210-220 lbs (95-100 kg)</SelectItem>
                      <SelectItem value="220-230 lbs (100-104 kg)">220-230 lbs (100-104 kg)</SelectItem>
                      <SelectItem value="230-240 lbs (104-109 kg)">230-240 lbs (104-109 kg)</SelectItem>
                      <SelectItem value="240-250 lbs (109-113 kg)">240-250 lbs (109-113 kg)</SelectItem>
                      <SelectItem value="250-260 lbs (113-118 kg)">250-260 lbs (113-118 kg)</SelectItem>
                      <SelectItem value="260-270 lbs (118-122 kg)">260-270 lbs (118-122 kg)</SelectItem>
                      <SelectItem value="270-280 lbs (122-127 kg)">270-280 lbs (122-127 kg)</SelectItem>
                      <SelectItem value="280+ lbs (127+ kg)">280+ lbs (127+ kg)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="bodyShape" className="text-sm text-muted-foreground">Body Shape</Label>
                  <Select value={bodyShape} onValueChange={setBodyShape}>
                    <SelectTrigger className="rounded-xl" data-testid="select-body-shape">
                      <SelectValue placeholder="Select body shape" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Athletic">Athletic</SelectItem>
                      <SelectItem value="Slim">Slim</SelectItem>
                      <SelectItem value="Average">Average</SelectItem>
                      <SelectItem value="Curvy">Curvy</SelectItem>
                      <SelectItem value="Muscular">Muscular</SelectItem>
                      <SelectItem value="Heavyset">Heavyset</SelectItem>
                      <SelectItem value="Petite">Petite</SelectItem>
                      <SelectItem value="Plus Size">Plus Size</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="eyeColor" className="text-sm text-muted-foreground">Eye Color</Label>
                  <Select value={eyeColor} onValueChange={setEyeColor}>
                    <SelectTrigger className="rounded-xl" data-testid="select-eye-color">
                      <SelectValue placeholder="Select eye color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Brown">Brown</SelectItem>
                      <SelectItem value="Blue">Blue</SelectItem>
                      <SelectItem value="Green">Green</SelectItem>
                      <SelectItem value="Hazel">Hazel</SelectItem>
                      <SelectItem value="Gray">Gray</SelectItem>
                      <SelectItem value="Amber">Amber</SelectItem>
                      <SelectItem value="Black">Black</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hairColor" className="text-sm text-muted-foreground">Hair Color</Label>
                  <Select value={hairColor} onValueChange={setHairColor}>
                    <SelectTrigger className="rounded-xl" data-testid="select-hair-color">
                      <SelectValue placeholder="Select hair color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Black">Black</SelectItem>
                      <SelectItem value="Brown">Brown</SelectItem>
                      <SelectItem value="Blonde">Blonde</SelectItem>
                      <SelectItem value="Red">Red</SelectItem>
                      <SelectItem value="Auburn">Auburn</SelectItem>
                      <SelectItem value="Gray">Gray</SelectItem>
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Salt and Pepper">Salt and Pepper</SelectItem>
                      <SelectItem value="Dyed/Other">Dyed/Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="nationality" className="text-sm text-muted-foreground">Nationality</Label>
                  <Select value={nationality} onValueChange={setNationality}>
                    <SelectTrigger className="rounded-xl" data-testid="select-nationality">
                      <SelectValue placeholder="Select nationality" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="British">British</SelectItem>
                      <SelectItem value="Canadian">Canadian</SelectItem>
                      <SelectItem value="Australian">Australian</SelectItem>
                      <SelectItem value="Irish">Irish</SelectItem>
                      <SelectItem value="Scottish">Scottish</SelectItem>
                      <SelectItem value="Welsh">Welsh</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Italian">Italian</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="Portuguese">Portuguese</SelectItem>
                      <SelectItem value="Dutch">Dutch</SelectItem>
                      <SelectItem value="Belgian">Belgian</SelectItem>
                      <SelectItem value="Swiss">Swiss</SelectItem>
                      <SelectItem value="Austrian">Austrian</SelectItem>
                      <SelectItem value="Swedish">Swedish</SelectItem>
                      <SelectItem value="Norwegian">Norwegian</SelectItem>
                      <SelectItem value="Danish">Danish</SelectItem>
                      <SelectItem value="Finnish">Finnish</SelectItem>
                      <SelectItem value="Polish">Polish</SelectItem>
                      <SelectItem value="Russian">Russian</SelectItem>
                      <SelectItem value="Ukrainian">Ukrainian</SelectItem>
                      <SelectItem value="Greek">Greek</SelectItem>
                      <SelectItem value="Turkish">Turkish</SelectItem>
                      <SelectItem value="Israeli">Israeli</SelectItem>
                      <SelectItem value="Indian">Indian</SelectItem>
                      <SelectItem value="Pakistani">Pakistani</SelectItem>
                      <SelectItem value="Bangladeshi">Bangladeshi</SelectItem>
                      <SelectItem value="Chinese">Chinese</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      <SelectItem value="Korean">Korean</SelectItem>
                      <SelectItem value="Vietnamese">Vietnamese</SelectItem>
                      <SelectItem value="Thai">Thai</SelectItem>
                      <SelectItem value="Filipino">Filipino</SelectItem>
                      <SelectItem value="Indonesian">Indonesian</SelectItem>
                      <SelectItem value="Malaysian">Malaysian</SelectItem>
                      <SelectItem value="Singaporean">Singaporean</SelectItem>
                      <SelectItem value="New Zealander">New Zealander</SelectItem>
                      <SelectItem value="South African">South African</SelectItem>
                      <SelectItem value="Nigerian">Nigerian</SelectItem>
                      <SelectItem value="Egyptian">Egyptian</SelectItem>
                      <SelectItem value="Kenyan">Kenyan</SelectItem>
                      <SelectItem value="Mexican">Mexican</SelectItem>
                      <SelectItem value="Brazilian">Brazilian</SelectItem>
                      <SelectItem value="Argentinian">Argentinian</SelectItem>
                      <SelectItem value="Chilean">Chilean</SelectItem>
                      <SelectItem value="Colombian">Colombian</SelectItem>
                      <SelectItem value="Venezuelan">Venezuelan</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    data-testid="button-save-attributes"
                    onClick={handleSaveAttributes}
                    disabled={updateAttributesMutation.isPending}
                    className="flex-1 rounded-full bg-primary hover:bg-primary/20 text-white transition-colors"
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
