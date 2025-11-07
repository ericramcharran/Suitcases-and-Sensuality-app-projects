import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import "@/nexus-styles.css";

export default function SparkitTermsOfService() {
  return (
    <div className="nexus-app min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <Link href="/sparkit" data-testid="link-back">
          <button
            className="mb-6 flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:opacity-80 transition-opacity"
            style={{ background: 'var(--nexus-gradient-full)' }}
            data-testid="button-back"
          >
            <ArrowLeft size={20} />
            Back to Spark It!
          </button>
        </Link>

        <div className="prose prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-4" style={{
            background: 'var(--nexus-gradient-full)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Terms of Service - Spark It!
          </h1>
          
          <p className="text-white/70 mb-8">Last Updated: October 30, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Acceptance of Terms</h2>
            <p className="text-white/80 leading-relaxed">
              Welcome to Spark It! ("Service", "App", "we", "us", or "our"). By accessing or using the Spark It! mobile application and website (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the Service.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              These Terms constitute a legally binding agreement between you and Spark It!. By creating an account or using any part of our Service, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. Description of Service</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Spark It! is a couples activity platform designed to help partners overcome decision fatigue through:
            </p>
            <ul className="text-white/80 space-y-2">
              <li>Simultaneous button press mechanic for activity generation</li>
              <li>Curated database of over 250+ activities for couples</li>
              <li>Trivia challenges and competitive scoreboard</li>
              <li>Video calling for long-distance relationships</li>
              <li>SMS and browser push notifications</li>
              <li>AI-powered location-based activity suggestions</li>
              <li>Premium subscription features</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. Eligibility</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              You must be at least 18 years old to use Spark It!. By using the Service, you represent and warrant that:
            </p>
            <ul className="text-white/80 space-y-2">
              <li>You are at least 18 years of age</li>
              <li>You have the legal capacity to enter into these Terms</li>
              <li>You will comply with these Terms and all applicable local, state, national, and international laws</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Account Registration and Security</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">4.1 Account Creation</h3>
            <p className="text-white/80 leading-relaxed mb-4">
              To use certain features of the Service, you must create an account by providing:
            </p>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>Your name</li>
              <li>A valid email address</li>
              <li>A secure password</li>
              <li>Optional: Phone number for SMS notifications</li>
              <li>Optional: Location (city/state) for AI activity suggestions</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">4.2 Account Security</h3>
            <p className="text-white/80 leading-relaxed mb-4">You are responsible for:</p>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Ensuring your password is strong and secure</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">4.3 Couple Code</h3>
            <p className="text-white/80 leading-relaxed mb-4">
              When creating an account, you will receive a unique couple code to share with your partner. You are responsible for:
            </p>
            <ul className="text-white/80 space-y-2">
              <li>Keeping this code confidential</li>
              <li>Only sharing it with your romantic partner</li>
              <li>Understanding that anyone with this code can join your couple account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Subscription Plans and Billing</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">5.1 Free Trial</h3>
            <p className="text-white/80 leading-relaxed mb-4">
              New users receive a trial period consisting of:
            </p>
            <ul className="text-white/80 space-y-2 mb-4">
              <li><strong>10 total sparks</strong> OR</li>
              <li><strong>7 days</strong>, whichever comes first</li>
            </ul>
            <p className="text-white/70 text-sm mb-4">
              Trial users do NOT receive premium features (custom avatars, video calling, etc.).
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">5.2 Premium Subscriptions</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white/5 rounded-lg border border-purple-500/30">
                <h4 className="text-lg font-semibold text-white mb-2">Monthly Plan - $6.99/month</h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>✓ Unlimited sparks</li>
                  <li>✓ Custom avatar uploads</li>
                  <li>✓ Video calling access</li>
                  <li>✓ All future premium features</li>
                </ul>
              </div>
              <div className="p-4 bg-white/5 rounded-lg border border-red-500/30">
                <h4 className="text-lg font-semibold text-white mb-2">Yearly Plan - $59.99/year</h4>
                <ul className="text-white/70 text-sm space-y-1">
                  <li>✓ All monthly plan features</li>
                  <li>✓ Save over 28% annually</li>
                  <li>✓ Best value!</li>
                </ul>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-white mb-3">5.3 Billing and Renewal</h3>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>Subscriptions automatically renew unless canceled at least 24 hours before the end of the current period</li>
              <li>Your payment method will be charged at the start of each subscription period</li>
              <li>Prices are subject to change with 30 days notice to active subscribers</li>
              <li>All payments are processed securely through Stripe</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">5.4 Cancellation and Refunds</h3>
            <ul className="text-white/80 space-y-2">
              <li>You may cancel your subscription at any time through the app settings</li>
              <li>Cancellations take effect at the end of the current billing period</li>
              <li>No refunds are provided for partial subscription periods</li>
              <li>Upon cancellation, you retain access to premium features until the end of your paid period</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. User Conduct</h2>
            <p className="text-white/80 leading-relaxed mb-4">You agree NOT to:</p>
            <ul className="text-white/80 space-y-2">
              <li>Use the Service for any illegal or unauthorized purpose</li>
              <li>Violate any laws in your jurisdiction</li>
              <li>Harass, abuse, or harm another person or couple</li>
              <li>Upload viruses, malware, or malicious code</li>
              <li>Attempt to gain unauthorized access to the Service</li>
              <li>Interfere with or disrupt the Service or servers</li>
              <li>Share your account with anyone other than your romantic partner</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. Disclaimers and Limitation of Liability</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">7.1 Service "As Is"</h3>
            <p className="text-white/80 leading-relaxed mb-4">
              THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">7.2 Relationship Outcomes</h3>
            <p className="text-white/80 leading-relaxed mb-4">
              We do not guarantee that use of Spark It! will improve your relationship, resolve relationship conflicts, or lead to any particular relationship outcome. Spark It! is an activity suggestion tool and not a substitute for professional relationship counseling.
            </p>

            <h3 className="text-xl font-semibold text-white mb-3">7.3 Limitation of Liability</h3>
            <p className="text-white/80 leading-relaxed">
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, SPARK IT! SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES. IN NO EVENT SHALL OUR TOTAL LIABILITY EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM, OR $100, WHICHEVER IS LESS.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Third-Party Services</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              The Service may integrate with third-party services, including:
            </p>
            <ul className="text-white/80 space-y-2">
              <li><strong>Stripe</strong> for payment processing</li>
              <li><strong>Daily.co</strong> for video calling</li>
              <li><strong>Twilio</strong> for SMS messaging</li>
              <li><strong>OpenAI</strong> for AI activity suggestions</li>
              <li><strong>Google Cloud Storage</strong> for file storage</li>
            </ul>
            <p className="text-white/80 leading-relaxed mt-4">
              Your use of these third-party services is subject to their respective terms of service and privacy policies. We are not responsible for the practices or policies of third-party services.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Termination</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              You may terminate your account at any time through Settings or by contacting our support team. We reserve the right to suspend or terminate your account immediately if you violate these Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Changes to Terms</h2>
            <p className="text-white/80 leading-relaxed">
              We reserve the right to modify these Terms at any time. If we make material changes, we will notify you via email or in-app notification. Your continued use of the Service after changes take effect constitutes acceptance of the updated Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">11. Governing Law</h2>
            <p className="text-white/80 leading-relaxed">
              These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">12. Contact Information</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              If you have questions about these Terms, please contact us:
            </p>
            <div className="space-y-2">
              <p className="text-white/80">
                <strong>Email:</strong>{' '}
                <a href="mailto:support@spark-itapp.com" className="text-purple-400 hover:text-purple-300">
                  support@spark-itapp.com
                </a>
              </p>
              <p className="text-white/80">
                <strong>Privacy Inquiries:</strong>{' '}
                <a href="mailto:privacy@spark-itapp.com" className="text-purple-400 hover:text-purple-300">
                  privacy@spark-itapp.com
                </a>
              </p>
              <p className="text-white/80">
                <strong>Website:</strong>{' '}
                <a href="https://spark-itapp.com" className="text-purple-400 hover:text-purple-300">
                  https://spark-itapp.com
                </a>
              </p>
            </div>
          </section>

          <div className="mt-12 p-6 bg-white/5 rounded-lg border border-white/10 text-center">
            <p className="text-white/90 font-semibold mb-2">
              BY CREATING AN ACCOUNT OR USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ THESE TERMS OF SERVICE, UNDERSTAND THEM, AND AGREE TO BE BOUND BY THEM.
            </p>
            <p className="text-white/70 text-sm mt-4">
              Thank you for using Spark It! We're excited to help you spark more meaningful moments with your partner!
            </p>
            <p className="text-white/70 text-sm mt-2">
              Spark connection, not screens. 💜⚡❤️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
