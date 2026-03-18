import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Privacy Policy</CardTitle>
            <p className="text-sm text-gray-500">Last updated: March 13, 2026</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Information We Collect</h2>
              <p className="text-gray-700 mb-2">We collect information you provide directly to us, including:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Account information (name, email address)</li>
                <li>Business card images and contact information you scan or input</li>
                <li>Exhibition and event details you create</li>
                <li>Places and locations you save</li>
                <li>Payment information (processed securely through Stripe)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-2">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your transactions and manage your subscriptions</li>
                <li>Send you technical notices and support messages</li>
                <li>Send follow-up reminders and thank you emails as you configure</li>
                <li>Respond to your comments and questions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. Information Sharing</h2>
              <p className="text-gray-700">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>With your consent or at your direction</li>
                <li>With service providers who perform services on our behalf (e.g., payment processing, email delivery)</li>
                <li>To comply with legal obligations or protect our rights</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Data Storage and Security</h2>
              <p className="text-gray-700">
                Your data is stored securely using industry-standard encryption. We implement appropriate technical 
                and organizational measures to protect your personal information against unauthorized access, 
                alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Your Rights</h2>
              <p className="text-gray-700 mb-2">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Access, update, or delete your personal information</li>
                <li>Export your data</li>
                <li>Opt-out of marketing communications</li>
                <li>Delete your account at any time</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. Cookies and Tracking</h2>
              <p className="text-gray-700">
                We use cookies and similar tracking technologies to provide functionality and improve your 
                experience. You can control cookies through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Third-Party Services</h2>
              <p className="text-gray-700 mb-2">We use third-party services including:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Stripe for payment processing</li>
                <li>Base44 for application infrastructure</li>
                <li>Email delivery services</li>
              </ul>
              <p className="text-gray-700 mt-2">
                These services have their own privacy policies governing their use of your information.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Children's Privacy</h2>
              <p className="text-gray-700">
                Our service is not directed to children under 13. We do not knowingly collect personal 
                information from children under 13.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this privacy policy from time to time. We will notify you of any changes by 
                posting the new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this privacy policy, please contact us through the Help section 
                in the app or email us at <a href="mailto:support@cardscan-pro.com" className="text-blue-600 hover:underline">support@cardscan-pro.com</a>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}