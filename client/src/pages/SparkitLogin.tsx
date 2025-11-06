import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, LogIn, Eye, EyeOff, Settings } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useState } from "react";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function SparkitLogin() {
  const [, setLocation] = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  // Get returnUrl from query params
  const urlParams = new URLSearchParams(window.location.search);
  const returnUrl = urlParams.get('returnUrl');

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const res = await apiRequest("POST", "/api/sparkit/auth/login", data);
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }
      return await res.json();
    },
    onSuccess: (data) => {
      // Store couple ID and partner role in localStorage FIRST
      localStorage.setItem("sparkitCoupleId", data.coupleId);
      localStorage.setItem("sparkitPartnerRole", data.partnerRole);
      
      // Clear ALL cached query data to force fresh fetch
      queryClient.clear();
      
      toast({
        description: `Welcome back, ${data.partnerName}!`,
      });
      
      // Sanitize returnUrl to prevent open redirect - only allow same-origin relative paths
      let safeRedirect = "/spark";
      if (returnUrl) {
        try {
          // Parse the URL to check if it's a valid relative path
          const url = new URL(returnUrl, window.location.origin);
          // Only allow if it's the same origin and is a relative path
          if (url.origin === window.location.origin && returnUrl.startsWith("/") && !returnUrl.startsWith("//")) {
            safeRedirect = returnUrl;
          }
        } catch {
          // Invalid URL, use default
          safeRedirect = "/spark";
        }
      }
      
      // Force a full page reload to ensure fresh data
      window.location.href = safeRedirect;
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

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
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <CardDescription>
            Log in to continue your Spark It! journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="your.email@example.com"
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          data-testid="input-password"
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
                disabled={loginMutation.isPending}
                data-testid="button-login"
              >
                {loginMutation.isPending ? (
                  "Logging in..."
                ) : (
                  <>
                    <LogIn className="w-4 h-4 mr-2" />
                    Log In
                  </>
                )}
              </Button>
            </form>
          </Form>

          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/sparkit/signup">
                <Button
                  variant="outline"
                  className="w-full border-purple-200 hover:bg-purple-50 dark:border-purple-800 dark:hover:bg-purple-950"
                  data-testid="link-signup"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create New Account
                </Button>
              </Link>

              <Link href="/sparkit/join">
                <Button
                  variant="outline"
                  className="w-full border-rose-200 hover:bg-rose-50 dark:border-rose-800 dark:hover:bg-rose-950"
                  data-testid="link-join"
                >
                  Have a Couple Code? Join Here
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
