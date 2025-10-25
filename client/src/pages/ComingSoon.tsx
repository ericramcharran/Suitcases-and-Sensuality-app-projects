import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Sparkles } from "lucide-react";
import { Link } from "wouter";

export default function ComingSoon() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-rose-600 bg-clip-text text-transparent">
            Coming Soon
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're building something special. Choose your experience below.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="hover-elevate active-elevate-2 h-full">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-500 to-purple-500 flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">The Executive Society</CardTitle>
              <CardDescription>
                A premium platform for professionals seeking authentic power exchange relationships
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/landing">
                <Button 
                  className="w-full" 
                  variant="default"
                  data-testid="button-executive-society"
                >
                  Enter Executive Society
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover-elevate active-elevate-2 h-full">
            <CardHeader>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-rose-500 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-2xl">Spark It!</CardTitle>
              <CardDescription>
                Beat decision fatigue with instant activity suggestions for couples
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/sparkit">
                <Button 
                  className="w-full" 
                  variant="default"
                  data-testid="button-spark-it"
                >
                  Enter Spark It!
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Select an app above to continue
        </p>
      </div>
    </div>
  );
}
