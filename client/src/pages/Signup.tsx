import { useState } from "react";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export default function Signup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");

  const createUserMutation = useMutation({
    mutationFn: async (userData: { name: string; role: string }) => {
      const res = await apiRequest("POST", "/api/users", userData);
      return await res.json();
    },
    onSuccess: (data: any) => {
      // Store user ID for later use
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userName', name);
      localStorage.setItem('userRole', role);
      setLocation("/profile-details");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  const canContinue = name.trim().length > 0 && role.length > 0;

  const handleContinue = () => {
    createUserMutation.mutate({ name, role });
  };

  return (
    <div className="min-h-screen bg-muted p-6">
      <button
        data-testid="button-back"
        onClick={() => setLocation("/guidelines")}
        className="mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-1 rounded-md"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-light mb-2 text-center text-foreground">Create Your Profile</h2>
        <p className="text-muted-foreground mb-8 text-center">Tell us about yourself</p>
        
        <div className="space-y-6">
          <div>
            <Label htmlFor="name" className="text-foreground mb-2 block">
              Name
            </Label>
            <Input
              data-testid="input-name"
              id="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-xl"
              disabled={createUserMutation.isPending}
            />
          </div>
          <div>
            <Label htmlFor="role" className="text-foreground mb-2 block">
              Role
            </Label>
            <Select value={role} onValueChange={setRole} disabled={createUserMutation.isPending}>
              <SelectTrigger
                data-testid="select-role"
                id="role"
                className="rounded-xl"
              >
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Master">Master</SelectItem>
                <SelectItem value="Domme">Domme</SelectItem>
                <SelectItem value="submissive">submissive</SelectItem>
                <SelectItem value="Switch">Switch</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-center">
            <Button
              data-testid="button-continue"
              onClick={handleContinue}
              disabled={!canContinue || createUserMutation.isPending}
              className="rounded-full bg-primary hover:bg-primary/20 text-white transition-colors px-12"
              size="lg"
            >
              {createUserMutation.isPending ? "Creating..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
