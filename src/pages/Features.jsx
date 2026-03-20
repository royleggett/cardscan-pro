import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Camera, Users, MapPin, Calendar, Mail, Star, 
  Shield, Globe, Award, TrendingUp, FileText, QrCode,
  Clock, Tag, Bell, Download, Upload, Sparkles
} from "lucide-react";

const features = [
  {
    icon: Camera,
    title: "Smart Business Card Scanning",
    description: "Snap a photo or upload an image to instantly digitize business cards with AI-powered data extraction.",
    benefits: [
      "Save time with automatic contact creation",
      "Never lose a business card again",
      "Works with any card design or language"
    ]
  },
  {
    icon: QrCode,
    title: "QR Code Recognition",
    description: "Scan QR codes directly from business cards to capture digital contact information instantly.",
    benefits: [
      "Instant vCard import",
      "Zero manual typing required",
      "Modern networking made easy"
    ]
  },
  {
    icon: Calendar,
    title: "Exhibition Management",
    description: "Create dedicated spaces for each trade show, conference, or networking event you attend.",
    benefits: [
      "Keep contacts organized by event",
      "Track exhibition dates and locations",
      "Add custom notes and photos for each event"
    ]
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Share exhibition access with colleagues using unique team codes for seamless collaboration.",
    benefits: [
      "Pool contacts with your team",
      "Everyone stays on the same page",
      "Perfect for sales teams and exhibitors"
    ]
  },
  {
    icon: Tag,
    title: "Smart Lead Qualification",
    description: "Mark contacts as Hot, Warm, or Cool leads and set custom follow-up dates.",
    benefits: [
      "Prioritize your best opportunities",
      "Never miss a follow-up deadline",
      "Custom tags for role-based filtering"
    ]
  },
  {
    icon: Bell,
    title: "Automated Follow-Up Reminders",
    description: "Receive email notifications when it's time to follow up with leads based on your preferences.",
    benefits: [
      "Configurable reminder schedules",
      "Hot leads get priority attention",
      "Stay on top of your pipeline"
    ]
  },
  {
    icon: Mail,
    title: "One-Click Thank You Emails",
    description: "Send personalized thank you emails instantly with customizable templates.",
    benefits: [
      "Make a professional impression fast",
      "Fully customizable email templates",
      "Track which contacts received emails"
    ]
  },
  {
    icon: MapPin,
    title: "Community Discover",
    description: "Share and discover local restaurants, hotels, attractions, and services at exhibition destinations.",
    benefits: [
      "Find trusted recommendations from fellow exhibitors",
      "Rate and review places you've visited",
      "Filter by category and community ratings"
    ]
  },
  {
    icon: Globe,
    title: "Taxi Booking Integration",
    description: "Book rides to any discovered location with one-tap Uber and Bolt integration.",
    benefits: [
      "Auto-detects your current location",
      "Opens ride apps with destination pre-filled",
      "Perfect for navigating unfamiliar cities"
    ]
  },
  {
    icon: FileText,
    title: "Advanced Search & Filtering",
    description: "Find contacts instantly with powerful search across names, companies, notes, and custom tags.",
    benefits: [
      "Filter by lead temperature",
      "Search by exhibition or date",
      "Export filtered results to CSV"
    ]
  },
  {
    icon: Download,
    title: "Import & Export",
    description: "Import existing contacts from CSV/Excel and export your data anytime for backup or CRM integration.",
    benefits: [
      "No vendor lock-in - your data is yours",
      "Integrate with existing CRM systems",
      "Bulk operations save hours of work"
    ]
  },
  {
    icon: QrCode,
    title: "Digital Business Card",
    description: "Create your own digital business card with QR code for instant sharing at events.",
    benefits: [
      "No printing costs",
      "Update anytime without reprinting",
      "Share via QR code or native sharing"
    ]
  },
  {
    icon: Award,
    title: "Rewards & Milestones",
    description: "Earn badges, discounts, and free subscription time as you use the app and contribute to the community.",
    benefits: [
      "Get rewarded for active usage",
      "Unlock exclusive badges",
      "Earn free subscription extensions"
    ]
  },
  {
    icon: Shield,
    title: "Privacy & Security",
    description: "Your data is encrypted and secure. Choose what to share publicly on Discover.",
    benefits: [
      "Bank-level encryption",
      "Control your privacy settings",
      "GDPR compliant"
    ]
  },
  {
    icon: Sparkles,
    title: "AI-Powered Intelligence",
    description: "Smart algorithms extract and organize contact data, detect duplicates, and suggest improvements.",
    benefits: [
      "Automatic phone number categorization",
      "Country detection from addresses",
      "Duplicate contact warnings"
    ]
  },
  {
    icon: TrendingUp,
    title: "Analytics & Insights",
    description: "Track your networking progress with contact counts, follow-up rates, and community contributions.",
    benefits: [
      "See your growth over time",
      "Measure follow-up effectiveness",
      "Optimize your networking strategy"
    ]
  }
];

const plans = [
  {
    name: "Free",
    price: "£0",
    features: [
      "10 business card scans",
      "Unlimited exhibitions",
      "Basic contact management",
      "Digital business card"
    ]
  },
  {
    name: "Places",
    price: "£20/year",
    features: [
      "Everything in Free",
      "Unlimited card scanning",
      "Community Discover access",
      "Rate & share places",
      "Taxi booking integration"
    ]
  },
  {
    name: "Premium",
    price: "£59/year",
    features: [
      "Everything in Places",
      "Advanced lead management",
      "Automated follow-up reminders",
      "Custom email templates",
      "Priority support",
      "Exclusive rewards & badges"
    ]
  }
];

export default function Features() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Everything You Need to Network Smarter
          </h1>
          <p className="text-xl text-blue-100 mb-8">
            From smart card scanning to community recommendations, CardScan Pro is your complete networking companion
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/Pricing">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                View Pricing
              </Button>
            </Link>
            <Link to="/Home">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Powerful Features, Real Benefits</h2>
          <p className="text-gray-600 text-lg">See exactly how CardScan Pro makes networking effortless</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div 
                key={i} 
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 rounded-xl p-3 flex-shrink-0">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600 mb-4">{feature.description}</p>
                    <div className="space-y-2">
                      {feature.benefits.map((benefit, j) => (
                        <div key={j} className="flex items-start gap-2">
                          <span className="text-green-500 mt-0.5">✓</span>
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Perfect For</h2>
            <p className="text-gray-600 text-lg">Whatever your networking needs, we've got you covered</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-5xl mb-4">🎪</div>
              <h3 className="text-xl font-bold mb-2">Trade Show Exhibitors</h3>
              <p className="text-gray-600">
                Scan hundreds of cards, collaborate with your team, and follow up fast while competitors are still typing
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-2">Sales Professionals</h3>
              <p className="text-gray-600">
                Qualify leads on the spot, set automatic reminders, and never lose track of a hot opportunity
              </p>
            </div>
            <div className="text-center">
              <div className="text-5xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2">Frequent Travelers</h3>
              <p className="text-gray-600">
                Discover trusted local spots from fellow exhibitors and book rides with one tap
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Comparison */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Choose Your Plan</h2>
          <p className="text-gray-600 text-lg">Start free, upgrade anytime</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div 
              key={i}
              className={`bg-white rounded-2xl p-8 border-2 ${
                plan.name === "Premium" 
                  ? "border-blue-500 shadow-xl relative" 
                  : "border-gray-200 shadow-sm"
              }`}
            >
              {plan.name === "Premium" && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <div className="text-4xl font-bold text-blue-600 mb-6">{plan.price}</div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-2">
                    <span className="text-green-500 mt-1">✓</span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Link to="/Pricing">
                <Button 
                  className="w-full" 
                  variant={plan.name === "Premium" ? "default" : "outline"}
                >
                  {plan.name === "Free" ? "Get Started" : "Upgrade Now"}
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Transform Your Networking?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of professionals who've digitized thousands of business cards with CardScan Pro
          </p>
          <Link to="/Home">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
              Start Free Today
            </Button>
          </Link>
          <p className="text-sm text-blue-200 mt-4">No credit card required • 10 free scans included</p>
        </div>
      </div>
    </div>
  );
}