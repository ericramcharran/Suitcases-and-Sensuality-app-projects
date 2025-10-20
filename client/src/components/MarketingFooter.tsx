import { Shield } from "lucide-react";
import { Link } from "wouter";

export function MarketingFooter() {
  return (
    <footer className="border-t bg-card py-8 px-4 sm:px-6" data-testid="section-footer">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-4 mb-8">
          <div>
            <h3 className="font-medium mb-3">Platform</h3>
            <ul className="space-y-0.5 text-sm text-muted-foreground leading-tight">
              <li>
                <Link href="/">
                  <a
                    className="hover-elevate py-0.5 block cursor-pointer"
                    data-testid="link-footer-home"
                  >
                    Home
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/features">
                  <a
                    className="hover-elevate py-0.5 block cursor-pointer"
                    data-testid="link-footer-features"
                  >
                    Features
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/pricing">
                  <a
                    className="hover-elevate py-0.5 block cursor-pointer"
                    data-testid="link-footer-pricing"
                  >
                    Pricing
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/download">
                  <a
                    className="hover-elevate py-0.5 block cursor-pointer"
                    data-testid="link-footer-download"
                  >
                    Download App
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">Support</h3>
            <ul className="space-y-0.5 text-sm text-muted-foreground leading-tight">
              <li>
                <Link href="/faq">
                  <a
                    className="hover-elevate py-0.5 block cursor-pointer"
                    data-testid="link-footer-faq"
                  >
                    FAQ
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/help-support">
                  <a
                    className="hover-elevate py-0.5 block cursor-pointer"
                    data-testid="link-footer-help"
                  >
                    Help Center
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">Legal</h3>
            <ul className="space-y-0.5 text-sm text-muted-foreground leading-tight">
              <li>
                <Link href="/privacy-policy">
                  <a
                    className="hover-elevate py-0.5 block cursor-pointer"
                    data-testid="link-footer-privacy"
                  >
                    Privacy Policy
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <a
                    className="hover-elevate py-0.5 block cursor-pointer"
                    data-testid="link-footer-terms"
                  >
                    Terms of Service
                  </a>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium mb-3">About</h3>
            <ul className="space-y-0.5 text-sm text-muted-foreground leading-tight">
              <li>
                <Link href="/about">
                  <a
                    className="hover-elevate py-0.5 block cursor-pointer"
                    data-testid="link-footer-about"
                  >
                    About Us
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/how-it-works">
                  <a
                    className="hover-elevate py-0.5 block cursor-pointer"
                    data-testid="link-footer-how-it-works"
                  >
                    How It Works
                  </a>
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
