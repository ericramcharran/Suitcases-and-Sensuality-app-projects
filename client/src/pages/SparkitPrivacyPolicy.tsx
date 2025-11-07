import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import "@/nexus-styles.css";

export default function SparkitPrivacyPolicy() {
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
            Privacy Policy for Spark It!
          </h1>
          
          <p className="text-white/70 mb-8">Last Updated: October 30, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
            <p className="text-white/80 leading-relaxed">
              Welcome to Spark It! ("we," "us," or "our"). We are committed to protecting your privacy and the privacy of your relationship. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application and services.
            </p>
            <p className="text-white/80 leading-relaxed mt-4">
              <strong>By using Spark It!, you agree to the collection and use of information in accordance with this policy.</strong>
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">1. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">1.1 Information You Provide to Us</h3>
            
            <h4 className="text-lg font-semibold text-white/90 mb-2">Account Information:</h4>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>Partner names (customizable display names)</li>
              <li>Phone numbers (optional, for SMS notifications)</li>
              <li>Email addresses (for account recovery and notifications)</li>
              <li>Location (city/state, optional, for AI-powered local activity suggestions)</li>
              <li>Relationship preferences (long-distance, polyamorous, etc.)</li>
            </ul>

            <h4 className="text-lg font-semibold text-white/90 mb-2">Subscription Information:</h4>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>Payment details processed securely through Stripe (we do not store credit card numbers)</li>
              <li>Subscription tier (Free Trial, Monthly, or Yearly)</li>
              <li>Purchase history and billing information</li>
            </ul>

            <h4 className="text-lg font-semibold text-white/90 mb-2">Activity Data:</h4>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>Activity ratings and preferences</li>
              <li>Spark counter (number of activities generated)</li>
              <li>Scoreboard data (wins, ties, activity completion)</li>
              <li>Trivia contest results and answers</li>
              <li>Custom avatar selections (premium users)</li>
              <li>Uploaded avatar images (stored securely in object storage, premium users only)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">2. How We Use Your Information</h2>
            <p className="text-white/80 leading-relaxed mb-4">We use collected information for the following purposes:</p>
            
            <h3 className="text-xl font-semibold text-white mb-3">Core Service Delivery</h3>
            <ul className="text-white/80 space-y-2 mb-4">
              <li><strong>Facilitate the simultaneous button press experience</strong> between you and your partner</li>
              <li><strong>Generate personalized activity suggestions</strong> based on your preferences and location</li>
              <li><strong>Enable real-time notifications</strong> (SMS and browser push) when your partner presses the button</li>
              <li><strong>Provide trivia challenges</strong> and maintain competitive scoreboards</li>
              <li><strong>Support video calling</strong> for long-distance couples</li>
              <li><strong>Track your free trial</strong> (10 sparks or 7 days) and subscription status</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">3. How We Share Your Information</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We respect your privacy and <strong>do not sell your personal information to third parties</strong>.
            </p>
            
            <h3 className="text-xl font-semibold text-white mb-3">Service Providers</h3>
            <p className="text-white/80 leading-relaxed mb-4">
              We share limited information with trusted third-party service providers who help us operate our app:
            </p>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">Stripe (Payment Processing)</h4>
                <p className="text-white/70 text-sm">Purpose: Process subscription payments</p>
                <p className="text-white/70 text-sm">Data Shared: Email, payment information, subscription tier</p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">Twilio (SMS Notifications)</h4>
                <p className="text-white/70 text-sm">Purpose: Send text message alerts when partner presses button</p>
                <p className="text-white/70 text-sm">Data Shared: Phone number, notification content</p>
              </div>
              
              <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                <h4 className="text-lg font-semibold text-white mb-2">Daily.co (Video Calling)</h4>
                <p className="text-white/70 text-sm">Purpose: Enable video calls for long-distance couples</p>
                <p className="text-white/70 text-sm">Data Shared: Session metadata, connection quality</p>
                <p className="text-white/70 text-sm mt-2"><strong>Note:</strong> No video or audio content is recorded or stored</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">4. Your Privacy Rights</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">Access and Deletion</h3>
            <p className="text-white/80 leading-relaxed mb-4">You have the right to:</p>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>Access the personal information we hold about you</li>
              <li>Request a copy of your data in a portable format (JSON)</li>
              <li>Delete your account anytime through Settings</li>
              <li>Request complete data deletion (processed within 90 days)</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">Opt-Out Rights</h3>
            <ul className="text-white/80 space-y-2 mb-4">
              <li><strong>Email Marketing:</strong> Unsubscribe link in every promotional email</li>
              <li><strong>SMS Notifications:</strong> Disable in app Settings or reply STOP</li>
              <li><strong>Browser Push Notifications:</strong> Revoke permission in browser settings</li>
              <li><strong>AI Features:</strong> Optional and can be disabled by removing location data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">5. Data Security</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              We implement industry-standard security measures to protect your information:
            </p>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>HTTPS/TLS encryption for all data transmission</li>
              <li>Bcrypt password hashing (10 rounds)</li>
              <li>Secure session management with PostgreSQL storage</li>
              <li>Object storage encryption for uploaded avatars</li>
              <li>Regular security audits and updates</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">6. Children's Privacy</h2>
            <p className="text-white/80 leading-relaxed">
              Spark It! is designed for couples aged 18 and over. We do not knowingly collect information from children under 18. If we discover that a child under 18 has provided us with personal information, we will delete the account and all associated data immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">7. International Data Transfers</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              Spark It! is hosted on Replit's infrastructure, which may store data in multiple countries.
            </p>
            <p className="text-white/80 leading-relaxed">
              <strong>For EU Users:</strong> We comply with GDPR requirements. Data transfers use Standard Contractual Clauses (SCCs).
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">8. Region-Specific Rights</h2>
            
            <h3 className="text-xl font-semibold text-white mb-3">For EU Residents (GDPR)</h3>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>Right to access, rectify, erase, and port your data</li>
              <li>Right to object to processing</li>
              <li>Right to lodge a complaint with your local data protection authority</li>
            </ul>

            <h3 className="text-xl font-semibold text-white mb-3">For California Residents (CCPA)</h3>
            <ul className="text-white/80 space-y-2 mb-4">
              <li>Right to know what personal information is collected</li>
              <li>Right to delete personal information</li>
              <li>Right to opt-out of "sale" of personal information (we do not sell data)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">9. Updates to This Policy</h2>
            <p className="text-white/80 leading-relaxed">
              We may update this Privacy Policy from time to time. Changes will be communicated via in-app notification and email. Material changes will be notified 30 days in advance. Continued use of Spark It! after changes take effect constitutes acceptance of the new policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">10. Contact Us</h2>
            <p className="text-white/80 leading-relaxed mb-4">
              If you have questions, concerns, or requests regarding this Privacy Policy:
            </p>
            <div className="space-y-2">
              <p className="text-white/80">
                <strong>General Privacy:</strong>{' '}
                <a href="mailto:privacy@spark-itapp.com" className="text-purple-400 hover:text-purple-300">
                  privacy@spark-itapp.com
                </a>
              </p>
              <p className="text-white/80">
                <strong>Support:</strong>{' '}
                <a href="mailto:support@spark-itapp.com" className="text-purple-400 hover:text-purple-300">
                  support@spark-itapp.com
                </a>
              </p>
              <p className="text-white/80">
                <strong>Team:</strong>{' '}
                <a href="mailto:hi@spark-itapp.com" className="text-purple-400 hover:text-purple-300">
                  hi@spark-itapp.com
                </a>
              </p>
            </div>
            <p className="text-white/70 mt-4 text-sm">
              <strong>Response Time:</strong> We aim to respond to all privacy requests within 30 days.
            </p>
          </section>

          <div className="mt-12 p-6 bg-white/5 rounded-lg border border-white/10 text-center">
            <p className="text-white/90 font-semibold mb-2">
              By using Spark It!, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy.
            </p>
            <p className="text-white/70 text-sm">
              Spark connection, not screens. 💜⚡❤️
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
