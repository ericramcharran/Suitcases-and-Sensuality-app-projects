import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, Copy, Check, Share2, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";

const signupSchema = z.object({
  partner1Name: z.string().min(2, "Name must be at least 2 characters"),
  partner1Email: z.string().email("Please enter a valid email"),
  partner1Password: z.string().min(6, "Password must be at least 6 characters"),
  city: z.string().optional(),
  state: z.string().optional(),
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SparkitCoupleSignup() {
  const [couple, setCouple] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      partner1Name: "",
      partner1Email: "",
      partner1Password: "",
      city: "",
      state: "",
    },
  });

  const createCoupleMutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      const res = await apiRequest("POST", "/api/sparkit/couples", data);
      return await res.json();
    },
    onSuccess: (data) => {
      // Store couple ID in localStorage
      localStorage.setItem("sparkitCoupleId", data.id);
      
      setCouple(data);
      toast({
        title: "Account Created!",
        description: "Share your couple code with your partner to get started.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create couple. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SignupForm) => {
    createCoupleMutation.mutate(data);
  };

  const copyCode = () => {
    if (couple?.coupleCode) {
      navigator.clipboard.writeText(couple.coupleCode);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Couple code copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareInvite = async () => {
    const shareUrl = `${window.location.origin}/sparkit/join?code=${couple.coupleCode}`;
    const shareText = `Join me on Spark It! Use code: ${couple.coupleCode} or click this link: ${shareUrl}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Spark It!",
          text: shareText,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied!",
        description: "Invitation copied to clipboard",
      });
    }
  };

  if (couple) {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-rose-50">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-rose-500 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">Welcome, {couple.partner1Name}!</CardTitle>
            <CardDescription>Share this code with your partner to connect</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-3">
              <div className="text-sm text-muted-foreground">Your Couple Code</div>
              <div className="relative">
                <div 
                  className="text-4xl font-bold tracking-widest bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent"
                  data-testid="text-couple-code"
                >
                  {couple.coupleCode}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                onClick={copyCode}
                variant="outline"
                className="w-full"
                data-testid="button-copy-code"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Code
                  </>
                )}
              </Button>

              <Button
                onClick={shareInvite}
                className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700"
                data-testid="button-share-invite"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Invitation
              </Button>
            </div>

            <div className="text-center space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                Once your partner joins, you'll both have access to unlimited sparks together!
              </p>
              <Link href="/spark">
                <Button 
                  className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700 text-white font-semibold text-lg py-6 shadow-lg hover:shadow-xl transition-all"
                  size="lg"
                  data-testid="link-continue"
                >
                  Continue to Spark It! →
                </Button>
              </Link>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Already have a code?{" "}
                <Link href="/sparkit/join">
                  <a className="text-purple-600 hover:underline" data-testid="link-join">
                    Join a couple
                  </a>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="nexus-app min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-rose-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-rose-500 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Create Your Couple Account</CardTitle>
          <CardDescription>
            Start your Spark It! journey together
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="partner1Name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your name"
                        data-testid="input-partner-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partner1Email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your.email@example.com"
                        data-testid="input-partner-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partner1Password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Minimum 6 characters"
                          data-testid="input-partner-password"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          data-testid="button-toggle-password"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 pt-2">
                <div className="text-sm font-medium text-muted-foreground">Your Location (for AI activity suggestions)</div>
                <div className="grid grid-cols-2 gap-3">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="San Francisco"
                            data-testid="input-city"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="CA"
                            data-testid="input-state"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700"
                disabled={createCoupleMutation.isPending}
                data-testid="button-create-couple"
              >
                {createCoupleMutation.isPending ? "Creating..." : "Create Couple Account"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              You'll receive a unique code to share with your partner
            </p>
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Already have a code?{" "}
                <Link href="/sparkit/join">
                  <a className="text-purple-600 hover:underline" data-testid="link-join">
                    Join a couple
                  </a>
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
