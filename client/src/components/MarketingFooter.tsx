import { Shield } from "lucide-react";
import { Link } from "wouter";

export function MarketingFooter() {
  return (
    <footer className="border-t bg-card py-8 px-4 sm:px-6" data-testid="section-footer">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 mb-8">
          <div>
            <h3 className="font-medium mb-3">Platform</h3>
            <ul className="space-y-0 text-sm text-muted-foreground leading-tight">
              <li>
                <Link 
                  href="/"
                  className="py-0.5 block cursor-pointer hover:underline underline-offset-4"
                  data-testid="link-footer-home"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  href="/features"
                  className="py-0.5 block cursor-pointer hover:underline underline-offset-4"
                  data-testid="link-footer-features"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing"
                  className="py-0.5 block cursor-pointer hover:underline underline-offset-4"
                  data-testid="link-footer-pricing"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="/download"
                  className="py-0.5 block cursor-pointer hover:underline underline-offset-4"
                  data-testid="link-footer-download"
                >
                  Download App
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">Support</h3>
            <ul className="space-y-0 text-sm text-muted-foreground leading-tight">
              <li>
                <Link 
                  href="/faq"
                  className="py-0.5 block cursor-pointer hover:underline underline-offset-4"
                  data-testid="link-footer-faq"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  href="/help-support"
                  className="py-0.5 block cursor-pointer hover:underline underline-offset-4"
                  data-testid="link-footer-help"
                >
                  Help Center
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">Legal</h3>
            <ul className="space-y-0 text-sm text-muted-foreground leading-tight">
              <li>
                <Link 
                  href="/privacy-policy"
                  className="py-0.5 block cursor-pointer hover:underline underline-offset-4"
                  data-testid="link-footer-privacy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms"
                  className="py-0.5 block cursor-pointer hover:underline underline-offset-4"
                  data-testid="link-footer-terms"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">About</h3>
            <ul className="space-y-0 text-sm text-muted-foreground leading-tight">
              <li>
                <Link 
                  href="/about"
                  className="py-0.5 block cursor-pointer hover:underline underline-offset-4"
                  data-testid="link-footer-about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/how-it-works"
                  className="py-0.5 block cursor-pointer hover:underline underline-offset-4"
                  data-testid="link-footer-how-it-works"
                >
                  How It Works
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            © 2025 The Executive Society. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="w-4 h-4 text-primary" />
            <span>21+ Only · Safe · Consensual · Private</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
