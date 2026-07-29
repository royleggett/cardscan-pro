import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Terms of Service</CardTitle>
            <p className="text-sm text-gray-500">Last updated: July 29, 2026</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing or using CardScan Pro ("the Service"), you agree to be bound by these Terms of Service.
                If you do not agree to these terms, please do not use the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">2. Description of Service</h2>
              <p className="text-gray-700">
                CardScan Pro provides tools for scanning and digitising business cards, managing contacts
                and exhibitions, discovering community-shared places, and automating follow-up communications.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">3. User Accounts & Responsibilities</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>You must provide accurate and complete information when creating an account.</li>
                <li>You are responsible for maintaining the security of your account and password.</li>
                <li>You are solely responsible for ensuring you have consent to store and use any contact information you upload, in compliance with applicable data protection laws (including UK GDPR).</li>
                <li>You may not use the Service for any unlawful purpose or in violation of these Terms.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">4. Intellectual Property Rights</h2>
              <p className="text-gray-700 mb-2">
                The Service, including its design, branding, software, algorithms, content, and user interface
                (collectively, "CardScan Pro IP"), is owned by CardScan Pro and protected by copyright, trademark,
                and other applicable laws.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>The "CardScan Pro" name and logo are trademarks of CardScan Pro. You may not use them without prior written consent.</li>
                <li>You may not copy, reproduce, distribute, or create derivative works based on the Service.</li>
                <li>All rights not expressly granted to you in these Terms are reserved by CardScan Pro.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">5. Prohibited Uses & Anti-Scraping</h2>
              <p className="text-gray-700 mb-2">You agree NOT to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Use bots, crawlers, scrapers, or any automated means to extract data from the Service, including contacts, places, or exhibition data.</li>
                <li>Reverse engineer, decompile, disassemble, or otherwise attempt to derive the source code, algorithms, or internal workings of the Service.</li>
                <li>Access the Service through any means other than the official app interface provided by CardScan Pro.</li>
                <li>Systematically copy or store data displayed by the Service for the purpose of building a competing product.</li>
                <li>Interfere with or disrupt the Service, servers, or networks connected to the Service.</li>
                <li>Attempt to circumvent usage limits, paywalls, or subscription restrictions.</li>
                <li>Use the Service to develop, train, or improve any competing machine learning model or AI system.</li>
              </ul>
              <p className="text-gray-700 mt-2">
                Violations of these prohibitions may result in immediate account termination and may subject you to legal liability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">6. User Content & Licences</h2>
              <p className="text-gray-700">
                You retain ownership of the content you upload (business card images, contact details, exhibition
                information, places, and notes). By uploading content, you grant CardScan Pro a limited licence to
                host, store, and process that content solely to provide the Service to you and your authorised team members.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">7. Subscriptions & Billing</h2>
              <ul className="list-disc pl-6 text-gray-700 space-y-1">
                <li>Paid subscriptions (Places tier at £20/year, Premium tier at £59/year) are billed through Stripe.</li>
                <li>Subscriptions auto-renew unless cancelled before the renewal date.</li>
                <li>Free tier accounts are limited to 10 scanned cards.</li>
                <li>Refunds are handled on a case-by-case basis at the discretion of CardScan Pro.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">8. Service Availability & Disclaimer</h2>
              <p className="text-gray-700">
                The Service is provided "as is" and "as available" without warranties of any kind. We do not guarantee
                uninterrupted or error-free operation. We may modify, suspend, or discontinue the Service at any time
                without prior notice.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">9. Limitation of Liability</h2>
              <p className="text-gray-700">
                To the maximum extent permitted by law, CardScan Pro shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages arising from your use of the Service.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">10. Account Termination</h2>
              <p className="text-gray-700">
                You may delete your account at any time from the Settings page. We reserve the right to suspend or
                terminate accounts that violate these Terms, including any suspected scraping or automated data
                extraction activity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">11. Governing Law</h2>
              <p className="text-gray-700">
                These Terms are governed by the laws of England and Wales. Any disputes shall be subject to the
                exclusive jurisdiction of the courts of England and Wales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">12. Changes to These Terms</h2>
              <p className="text-gray-700">
                We may update these Terms from time to time. Continued use of the Service after changes constitutes
                acceptance of the updated Terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-3">13. Contact Us</h2>
              <p className="text-gray-700">
                Questions about these Terms? Email us at{" "}
                <a href="mailto:support@cardscan-pro.com" className="text-blue-600 hover:underline">
                  support@cardscan-pro.com
                </a>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}