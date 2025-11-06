import { useState, useEffect } from "react";
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
import { Heart, Sparkles, MessageCircle, Eye, EyeOff, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";

const joinSchema = z.object({
  coupleCode: z.string().min(6, "Couple code must be at least 6 characters").max(10, "Couple code must be at most 10 characters"),
  partner2Name: z.string().min(2, "Name must be at least 2 characters"),
  partner2Email: z.string().email("Please enter a valid email"),
  partner2Password: z.string().min(6, "Password must be at least 6 characters"),
});

type JoinForm = z.infer<typeof joinSchema>;

export default function SparkitJoinCouple() {
  const [, setLocation] = useLocation();
  const [joined, setJoined] = useState(false);
  const [partnerName, setPartnerName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<JoinForm>({
    resolver: zodResolver(joinSchema),
    defaultValues: {
      coupleCode: "",
      partner2Name: "",
      partner2Email: "",
      partner2Password: "",
    },
  });

  // Pre-fill code from URL query param if available
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    if (code) {
      form.setValue("coupleCode", code.toUpperCase());
    }
  }, [form]);

  const joinCoupleMutation = useMutation({
    mutationFn: async (data: JoinForm) => {
      const res = await apiRequest("POST", "/api/sparkit/couples/join", data);
      return await res.json();
    },
    onSuccess: (data) => {
      // Store couple ID in localStorage
      localStorage.setItem("sparkitCoupleId", data.id);
      
      setPartnerName(data.partner1Name);
      setJoined(true);
      
      toast({
        title: "Connected!",
        description: `You're now connected with ${data.partner1Name}!`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to join couple. Please check your code and try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: JoinForm) => {
    joinCoupleMutation.mutate({
      ...data,
      coupleCode: data.coupleCode.toUpperCase(),
    });
  };

  const sendReminder = async () => {
    const signupUrl = `${window.location.origin}/sparkit/signup`;
    const reminderMessage = `Hey! I'm ready to use Spark It! together 💕\n\nIt's a fun app that helps us beat decision fatigue - we both press a button and get instant activity suggestions!\n\nCan you create an account and share your couple code with me?\n\nSign up here: ${signupUrl}\n\nThen send me your couple code so I can join you! ✨`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on Spark It!",
          text: reminderMessage,
        });
      } catch (error) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(reminderMessage);
      toast({
        title: "Reminder Copied!",
        description: "Paste this message and send it to your partner",
      });
    }
  };

  if (joined) {
    return (
      <div className="nexus-app min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-rose-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setLocation("/sparkit/settings")}
          className="absolute top-4 right-4 border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] backdrop-blur-sm bg-white/5"
          data-testid="button-settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-rose-500 flex items-center justify-center">
              <Heart className="w-8 h-8 text-white animate-pulse" />
            </div>
            <CardTitle className="text-2xl">You're Connected!</CardTitle>
            <CardDescription>
              Welcome to Spark It! You and {partnerName} are now a team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-r from-purple-100 to-rose-100 rounded-lg p-6 text-center space-y-2">
              <p className="text-sm font-medium">What's Next?</p>
              <p className="text-xs text-muted-foreground">
                Start pressing the Spark It! button together to discover fun activities
              </p>
            </div>

            <Button
              onClick={() => setLocation("/spark")}
              className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700"
              data-testid="button-start-sparking"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start Sparking!
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              <p>Free: 3 sparks per day</p>
              <p>Upgrade to Premium for unlimited sparks</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="nexus-app min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 to-rose-50">
      <Button
        variant="outline"
        size="icon"
        onClick={() => setLocation("/sparkit/settings")}
        className="absolute top-4 right-4 border-2 border-white/40 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] backdrop-blur-sm bg-white/5"
        data-testid="button-settings"
      >
        <Settings className="h-5 w-5" />
      </Button>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-rose-500 flex items-center justify-center">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Join Your Partner</CardTitle>
          <CardDescription>
            Enter the code your partner shared with you
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="coupleCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Couple Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter couple code"
                        className="text-center text-2xl tracking-widest uppercase font-bold"
                        maxLength={10}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        data-testid="input-couple-code"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="partner2Name"
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
                name="partner2Email"
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
                name="partner2Password"
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

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-rose-600 hover:from-purple-700 hover:to-rose-700"
                disabled={joinCoupleMutation.isPending}
                data-testid="button-join-couple"
              >
                {joinCoupleMutation.isPending ? "Connecting..." : "Connect with Partner"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center space-y-4">
            <div className="bg-gradient-to-r from-purple-50 to-rose-50 rounded-lg p-4 border border-purple-200">
              <p className="font-medium mb-2 text-sm">Don't have a code?</p>
              <p className="text-xs text-muted-foreground mb-3">
                Ask your partner to create an account and share their code with you
              </p>
              <Button
                onClick={sendReminder}
                variant="outline"
                size="sm"
                className="w-full"
                data-testid="button-send-reminder"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Send Partner a Reminder
              </Button>
            </div>
            
            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                Need to create a couple?{" "}
                <Link href="/sparkit/signup">
                  <span className="text-purple-600 hover:underline cursor-pointer" data-testid="link-signup">
                    Create account
                  </span>
                </Link>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
