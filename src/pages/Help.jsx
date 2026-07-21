import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import HelpSection from "../components/help/HelpSection";
import FeedbackForm from "../components/help/FeedbackForm";

const TABS = ["Exhibitions & Scanning", "Discover & Places", "Feedback"];

export default function Help() {
  const [tab, setTab] = useState(0);

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">💡</div>
        <h1 className="text-3xl font-bold text-gray-900">Help Centre</h1>
        <p className="text-gray-500 mt-2">Everything you need to know about CardScan-Pro — written in plain English, we promise!</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
              tab === i ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab 1 — Exhibitions & Scanning */}
      {tab === 0 && (
        <div className="space-y-3">
          <HelpSection icon="🏛️" title="What is an Exhibition?">
            <p>Think of an <strong>Exhibition</strong> as a folder for a specific event you're attending — a trade show, conference, networking event, or even just a busy sales day.</p>
            <p>Everything you scan at that event lives inside that Exhibition. This keeps your contacts neatly organised by event, so you're never digging through hundreds of cards wondering "where did I meet this person?"</p>
            <p><strong>To create one:</strong> Go to <em>Exhibitions</em> in the menu → tap the <em>+</em> button → fill in the name and dates. Done!</p>
          </HelpSection>

          <HelpSection icon="📇" title="How do I scan a business card?">
            <p>From inside an Exhibition, tap <strong>Scan Card</strong>. You'll see several options:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Scan Single Side</strong> — takes a photo of one side of the card using your camera.</li>
              <li><strong>Scan Both Sides</strong> — for double-sided cards. You'll be asked to photograph the front, then the back.</li>
              <li><strong>Scan QR Code</strong> — point your camera at a QR code on the card.</li>
              <li><strong>Upload Image</strong> — choose a photo you've already taken from your gallery.</li>
              <li><strong>Manual Entry</strong> — type the details in yourself (great when the card just won't scan properly!).</li>
              <li><strong>Batch Scan</strong> — upload multiple card photos at once. Perfect for end-of-day catch-ups.</li>
            </ul>
            <p className="mt-2">Our AI reads the card and fills in the details for you. You can always check and edit before saving.</p>
          </HelpSection>

          <HelpSection icon="🔥" title="What does Hot, Warm, and Cool mean?">
            <p>These are <strong>lead temperatures</strong> — a quick way to tag how promising a contact is:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>🔥 <strong>Hot</strong> — Very interested. Follow up within 24 hours!</li>
              <li>🌡️ <strong>Warm</strong> — Good potential. Follow up within a few days.</li>
              <li>❄️ <strong>Cool</strong> — Worth keeping, but no rush. Follow up in a week or two.</li>
              <li>⬜ <strong>None</strong> — No follow-up needed right now.</li>
            </ul>
            <p className="mt-2">You can set this when saving a card, or change it later from the contact's detail page.</p>
          </HelpSection>

          <HelpSection icon="📧" title="How do I send a Thank You email?">
            <p>After scanning a card, you'll be asked if you'd like to send the contact a friendly <strong>Thank You email</strong>. Just tick the box and it goes automatically!</p>
            <p className="mt-2">You can also customise the email template to match your own style. Go to <em>Settings → Email Templates</em> to personalise the message.</p>
            <p className="mt-2">The email is sent from your CardScan-Pro account and includes your name, so it feels personal — not automated!</p>
          </HelpSection>

          <HelpSection icon="👥" title="What is a Team Exhibition?">
            <p>If you're attending an event <strong>with colleagues</strong>, you can share an Exhibition so everyone's scans go into the same place.</p>
            <p className="mt-2"><strong>As the organiser:</strong> When creating an Exhibition, tick <em>Team Exhibition</em>. You'll get a unique code like <em>EXPO-AB12</em>.</p>
            <p><strong>As a team member:</strong> On the Home screen, tap <em>Join Exhibition</em>, enter the code, and you're in!</p>
            <p className="mt-2">Everyone on the team can see and add contacts to the shared Exhibition.</p>
          </HelpSection>

          <HelpSection icon="📦" title="What is Batch Scan?">
            <p>Had a busy day and ended up with a pile of business cards? <strong>Batch Scan</strong> is your best friend.</p>
            <p className="mt-2">Take photos of all your cards (one photo per card), then select them all at once using Batch Scan. The app processes them all and then shows you a <strong>review screen</strong> where you can:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Check and edit each contact's details</li>
              <li>Set a lead temperature for each one</li>
              <li>Choose who gets a Thank You email</li>
              <li>Remove any cards you don't need</li>
            </ul>
            <p className="mt-2">Then tap <strong>Save All</strong> and you're done!</p>
          </HelpSection>

          <HelpSection icon="💾" title="How do I export contacts?">
            <p>Go to <em>Exhibitions</em>, open the exhibition you want to export from, and look for the <strong>Export</strong> option.</p>
            <p className="mt-2">You can export your contacts as a <strong>CSV file</strong> (opens in Excel or Google Sheets) or save them directly to your phone's contacts app as a <strong>vCard (.vcf)</strong> file.</p>
          </HelpSection>

          <HelpSection icon="🔒" title="Is my data private?">
            <p>Absolutely. Your scanned contacts and exhibitions are <strong>completely private</strong> — only you (and your team members, if you've set up a Team Exhibition) can see them.</p>
            <p className="mt-2">Nothing in the Exhibitions & Scanning part of the app is ever shared publicly.</p>
          </HelpSection>
        </div>
      )}

      {/* Tab 2 — Discover & Places */}
      {tab === 1 && (
        <div className="space-y-3">
          <HelpSection icon="🧭" title="What is the Discover section?">
            <p>The <strong>Discover</strong> section is the community side of CardScan-Pro — completely separate from your private scanning.</p>
            <p className="mt-2">When you're at an exhibition in an unfamiliar city, wouldn't it be great to know where the best restaurants, coffee shops, and hotels are? That's exactly what Discover is for.</p>
            <p className="mt-2">Other CardScan-Pro users share their favourite places, and you can browse and benefit from their recommendations!</p>
          </HelpSection>

          <HelpSection icon="📍" title="How do I add a place?">
            <p>Inside any Exhibition, tap the <strong>Places</strong> tab, then tap <strong>Add Place</strong>.</p>
            <p className="mt-2">You can add:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>The place's name and category (Restaurant, Hotel, Café, etc.)</li>
              <li>The address (or use the location button to detect it automatically)</li>
              <li>A website link</li>
              <li>Your personal notes and star rating</li>
              <li>Category-specific features (e.g. "Vegan options", "Early check-in")</li>
            </ul>
          </HelpSection>

          <HelpSection icon="🌍" title="Public vs Private places — what's the difference?">
            <p>When adding a place, you'll see a <strong>"Share with community"</strong> toggle.</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong>Private (off)</strong> — Only you can see this place. It's just for your own notes.</li>
              <li><strong>Public (on)</strong> — Your recommendation appears in the Discover section for all CardScan-Pro users to benefit from.</li>
            </ul>
            <p className="mt-2">You're in total control. If you're not sure, leave it private — you can always make it public later!</p>
          </HelpSection>

          <HelpSection icon="⭐" title="What do the star ratings mean?">
            <p>Star ratings are entirely your personal opinion — there are no rules!</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>⭐ — Not great, but worth knowing about</li>
              <li>⭐⭐ — Decent</li>
              <li>⭐⭐⭐ — Good, would go again</li>
              <li>⭐⭐⭐⭐ — Really good, would recommend</li>
              <li>⭐⭐⭐⭐⭐ — Absolutely brilliant, tell everyone!</li>
            </ul>
          </HelpSection>

          <HelpSection icon="🤝" title="Can my team see my places?">
            <p>Yes! If you're part of a <strong>Team Exhibition</strong>, places added to that exhibition can be seen by all team members — great for making sure everyone on your team knows where to eat!</p>
            <p className="mt-2">Public places also appear in the community <strong>Discover</strong> section for all users.</p>
          </HelpSection>
        </div>
      )}

      {/* Tab 3 — Feedback */}
      {tab === 2 && (
        <div>
          <div className="text-center mb-6">
            <div className="text-4xl mb-2">💬</div>
            <h2 className="text-xl font-bold text-gray-800">We'd love to hear from you</h2>
            <p className="text-gray-500 text-sm mt-1">
              Good, bad, or "I have no idea what I'm doing" — we want to know. Every piece of feedback helps make CardScan-Pro better for everyone.
            </p>
          </div>
          <FeedbackForm />
        </div>
      )}

      {/* Bottom support note */}
      <div className="mt-8 bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
        <p className="text-sm text-blue-800">
          Still stuck? Drop us an email at{" "}
          <a href="mailto:support@cardscan-pro.com" className="font-semibold underline">
            support@cardscan-pro.com
          </a>
          {" "}and we'll get back to you as soon as we can.
        </p>
      </div>
    </div>
  );
}