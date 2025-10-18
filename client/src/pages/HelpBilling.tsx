import { ChevronLeft, CreditCard, Calendar, DollarSign, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useCallback } from "react";

export default function HelpBilling() {
  const [, setLocation] = useLocation();

  const handleBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/help-support");
    }
  }, [setLocation]);

  return (
    <div className="min-h-screen bg-muted p-4 sm:p-6">
      <button
        data-testid="button-back"
        onClick={handleBack}
        className="mb-4 sm:mb-6 text-muted-foreground flex items-center gap-1 hover-elevate active-elevate-2 px-2 py-2 rounded-md min-h-[44px]"
      >
        <ChevronLeft className="w-5 h-5" />
        Back
      </button>

      <div className="max-w-2xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-light mb-2 text-foreground">Subscription & Billing</h2>
        <p className="text-muted-foreground mb-6">Manage your membership and billing</p>

        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-primary" />
              Subscription Plans
            </h3>
            <div className="space-y-4 text-foreground/80">
              <p>
                The Executive Society offers role-specific subscription tiers designed for different commitment levels.
              </p>
              
              <div>
                <h4 className="font-medium text-foreground mb-2">Dominant / Domme / Master Plans</h4>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Monthly:</strong> $249/month - Full access with no commitment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>3-Month:</strong> $229/month (Save 8%) - $687 total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>6-Month:</strong> $199/month (Save 20%) - $1,194 total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>1-Year:</strong> $149/month (Save 40%) - $1,788 total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>5-Year:</strong> $119/month (Save 52%) - $7,140 total - Best Value</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium text-foreground mb-2">Submissive / Switch Plans</h4>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Monthly:</strong> $25/month - Full access with no commitment</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>3-Month:</strong> $23/month - $69 total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>6-Month:</strong> $20/month - $120 total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>1-Year:</strong> $18/month - $216 total</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>5-Year:</strong> $15/month - $900 total - Best Value</span>
                  </li>
                </ul>
              </div>

              <p className="text-sm italic">
                All plans include full access to matching, messaging, profile features, and customer support.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Payment & Billing
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                We use Stripe for secure payment processing. Your financial information is never stored on our servers.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Accepted Methods:</strong> All major credit cards, debit cards, and digital wallets (Apple Pay, Google Pay).</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Secure Processing:</strong> PCI-compliant encryption protects all payment information.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Billing Date:</strong> You're charged on the date you subscribe, then automatically on each renewal date.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Receipts:</strong> Email receipts are sent automatically after each successful payment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Update Payment Method:</strong> Change your card or payment information anytime in Settings → Subscription.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-primary" />
              Auto-Renewal & Cancellation
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                All subscriptions automatically renew to ensure uninterrupted access to the platform.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Automatic Renewal:</strong> Your subscription renews automatically at the end of each billing period.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Renewal Reminder:</strong> We send email reminders 7 days before your renewal date.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Cancel Anytime:</strong> Cancel your subscription from Settings → Subscription with no cancellation fees.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Access Until End:</strong> After canceling, you retain full access until the end of your current billing period.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Reactivation:</strong> Reactivate a canceled subscription anytime before your access expires.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Data Retention:</strong> Profile and match data are preserved for 90 days after subscription ends.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Refund Policy
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                We offer refunds within specific timeframes to ensure satisfaction while protecting our community.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>7-Day Window:</strong> Request a full refund within 7 days of initial subscription purchase.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Renewal Refunds:</strong> Auto-renewal charges may be refunded if requested within 48 hours of billing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Processing Time:</strong> Refunds are processed within 5-7 business days and appear on your statement within 10 business days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>How to Request:</strong> Contact support@executivesociety.com with your account email and reason for refund.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Partial Refunds:</strong> Multi-month subscriptions are not eligible for prorated refunds after the 7-day window.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Violations:</strong> No refunds are issued for accounts terminated due to violations of terms of service.</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Managing Your Subscription
            </h3>
            <div className="space-y-3 text-foreground/80">
              <p>
                Access all subscription management tools from your Settings page.
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>View Current Plan:</strong> See your active plan, billing period, and next renewal date.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Upgrade Plan:</strong> Switch to a longer billing period anytime to save more money.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Update Payment:</strong> Change your credit card or payment method without losing access.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Billing History:</strong> Access all past invoices and payment receipts.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span><strong>Pause Account:</strong> Take a break without losing your profile data (available on annual plans).</span>
                </li>
              </ul>
            </div>
          </Card>

          <Card className="p-6 bg-primary/5 border-primary/20">
            <h3 className="text-lg font-medium mb-3 text-foreground">Billing Support</h3>
            <div className="space-y-2 text-foreground/80 text-sm">
              <p>
                For billing questions, payment issues, or refund requests:
              </p>
              <p className="flex items-start gap-2 mt-3">
                <span className="text-primary mt-1">📧</span>
                <span>Email: billing@executivesociety.com</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary mt-1">💬</span>
                <span>Live Chat: Available in Settings → Help & Support</span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-primary mt-1">⏰</span>
                <span>Response Time: Within 24 hours (usually faster)</span>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
