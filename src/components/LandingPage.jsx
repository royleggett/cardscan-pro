import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Users, MapPin, Globe, Award, Zap, Shield, Smartphone, Image } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function LandingPage() {
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [showDemoDialog, setShowDemoDialog] = useState(false);

  const handleGetStarted = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  const handleDemoMode = () => {
    setShowDemoDialog(true);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const features = [
    {
      id: "scanning",
      icon: Camera,
      iconColor: "text-blue-600",
      bgColor: "bg-blue-100",
      title: "Instant Scanning",
      brief: "Scan single or double-sided cards, QR codes, or upload images. AI extracts every detail instantly.",
      details: "Our advanced AI-powered scanner captures every detail from business cards in seconds. Scan both sides of a card, read QR codes instantly, or upload photos taken earlier. Works offline and online, perfect for busy trade shows where internet might be spotty. The AI automatically categorizes phone numbers (mobile, landline, fax) and detects the contact's country from their address.",
      screenshots: [
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e3b1d0b387a294f20142e9/2c77ca7bc_Scanning_1.png",
        "https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e3b1d0b387a294f20142e9/753dbd8c3_Scanning_2.png"
      ]
    },
    {
      id: "crm",
      icon: Shield,
      iconColor: "text-purple-600",
      bgColor: "bg-purple-100",
      title: "Export to CRM",
      brief: "Export your contacts to Excel for CRM import, reporting, or backup. Your data, your control.",
      details: "Export your entire contact database or specific exhibitions to Excel format with one click. The exported file is perfectly formatted for import into Salesforce, HubSpot, Zoho, or any CRM system. Includes all contact details, company information, and custom notes. You can also import contacts via CSV, making it easy to migrate from other systems or collaborate with your team.",
      screenshot: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop"
    },
    {
      id: "places",
      icon: MapPin,
      iconColor: "text-orange-600",
      bgColor: "bg-orange-100",
      title: "Places That Matter",
      brief: "Save hotels, restaurants, venues. Share with the community or keep them private.",
      details: "Never forget that amazing restaurant near the convention center. Save hotels, restaurants, bars, cafes, taxi ranks, and tourist attractions for each city you visit. Add ratings, notes, and photos. Keep places private for your personal reference, or share them with the community to help fellow travelers. When you return to a city, all your saved places are instantly available.",
      screenshot: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop"
    },
    {
      id: "community",
      icon: Users,
      iconColor: "text-green-600",
      bgColor: "bg-green-100",
      title: "Community Powered",
      brief: "Discover places shared by professionals in your city or exhibition. Local insights, global network.",
      details: "Benefit from the collective knowledge of thousands of business travelers and exhibition attendees. When you visit a city or attend an exhibition, automatically see places shared by other professionals who've been there before. Filter by category, ratings, and proximity. Share your own discoveries to help the community. It's like having a local guide in every city you visit.",
      screenshot: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop"
    },
    {
      id: "team",
      icon: Globe,
      iconColor: "text-indigo-600",
      bgColor: "bg-indigo-100",
      title: "Team Exhibitions",
      brief: "Invite your whole team to collaborate on an exhibition. Share contacts, leads, and insights in real time.",
      details: "Running an exhibition with a team? Create a shared exhibition and invite colleagues with a simple join code. Every team member can scan cards and add contacts — all visible to the whole team instantly. The exhibition owner controls the event details, while team members focus on networking. Perfect for sales teams, trade shows, and conferences where multiple people are working the floor at once.",
      screenshot: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
    },
    {
      id: "personalise",
      icon: Image,
      iconColor: "text-pink-600",
      bgColor: "bg-pink-100",
      title: "Personalise Your Exhibitions",
      brief: "Add a custom cover photo to each exhibition card so your events are instantly recognisable at a glance.",
      details: "Give each of your exhibitions its own identity by adding a cover photo — a shot of the venue, your stand, the city skyline, or anything that captures the moment. Photos are uploaded in seconds and appear right on the exhibition card, making it easy to find the right event at a glance. It's a small touch that makes your event history feel personal and organised.",
      screenshot: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header Navigation */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-end">
          <Link to="/Features">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold shadow-lg"
            >
              View Features & Pricing →
            </Button>
          </Link>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e3b1d0b387a294f20142e9/bcdfcf951_CardScanPro_Icon.png" 
            alt="CardScanner Pro" 
            className="h-32 w-32 mx-auto mb-8"
          />
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Your Network, Captured. Organized. Always With You.
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Never Lose a
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Connection </span>
            Again
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Scan business cards, organize contacts, discover local places, and export everything to your CRM. The ultimate companion for exhibitions and business travel.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-6 shadow-lg transition-all duration-150 active:scale-95"
            >
              Get Started Free
            </Button>
            <Button 
              onClick={handleDemoMode}
              size="lg"
              variant="outline"
              className="text-lg px-8 py-6 border-2 border-green-500 text-green-600 hover:bg-green-50 transition-all duration-150 active:scale-95"
            >
              🎯 Try Demo Mode
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 border-2 transition-all duration-150 active:scale-95"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            <span className="inline-flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Demo Mode: Explore the app instantly with pre-loaded test data
            </span>
          </p>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Card 
                key={feature.id}
                className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-xl transition-all cursor-pointer hover:scale-105"
                onClick={() => setSelectedFeature(feature)}
              >
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                    <Icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.brief}</p>
                  <p className="text-blue-600 text-sm mt-3 font-medium">Click to learn more →</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Demo Mode Dialog */}
        <Dialog open={showDemoDialog} onOpenChange={setShowDemoDialog}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl">🎯 Demo Mode Credentials</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <p className="text-gray-600">
                Use these credentials to explore CardScan Pro with pre-loaded test data:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Email</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">demo.cardscanpro@gmail.com</code>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard("demo.cardscanpro@gmail.com")}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Password</label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 bg-white px-3 py-2 rounded border text-sm">DemoTester2026!</code>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => copyToClipboard("DemoTester2026!")}
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  💡 Click the credentials to copy them, then paste into the login screen.
                </p>
              </div>

              <Button 
                onClick={() => {
                  setShowDemoDialog(false);
                  base44.auth.redirectToLogin(window.location.href);
                }}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                Go to Login Screen
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Feature Detail Dialog */}
        <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            {selectedFeature && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 ${selectedFeature.bgColor} rounded-lg flex items-center justify-center`}>
                      {React.createElement(selectedFeature.icon, { className: `w-6 h-6 ${selectedFeature.iconColor}` })}
                    </div>
                    <DialogTitle className="text-2xl">{selectedFeature.title}</DialogTitle>
                  </div>
                </DialogHeader>
                <div className="space-y-6">
                  {selectedFeature.screenshots ? (
                    <div className="grid grid-cols-2 gap-4">
                      {selectedFeature.screenshots.map((screenshot, index) => (
                        <div key={index} className="rounded-lg overflow-hidden">
                          <img 
                            src={screenshot} 
                            alt={`${selectedFeature.title} ${index + 1}`}
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg overflow-hidden">
                      <img 
                        src={selectedFeature.screenshot} 
                        alt={selectedFeature.title}
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}
                  <p className="text-gray-700 leading-relaxed text-lg">
                    {selectedFeature.details}
                  </p>
                  <Button 
                    onClick={handleGetStarted}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    size="lg"
                  >
                    Get Started Free
                  </Button>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* How It Works */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div>
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Scan Anything</h3>
              <p className="text-gray-600">Business cards, QR codes, or upload images. Works offline and online.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Stay Organized</h3>
              <p className="text-gray-600">Contacts and places sorted by exhibition. Search, filter, and find instantly.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Collaborate & Export</h3>
              <p className="text-gray-600">Share exhibitions with your team in real time. Export to Excel for CRM integration.</p>
            </div>
          </div>
        </div>

        {/* Awards Section */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            Earn Rewards While You Network
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Network More. <span className="bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">Win More.</span></h2>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">CardScan Pro isn't just about organising contacts — it rewards you for doing it. Every card you scan, every exhibition you attend, every connection you make earns you points towards exclusive achievements.</p>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <div className="text-4xl mb-3">🏆</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Claim Trophies</h3>
              <p className="text-gray-600 text-sm">Unlock achievements for scanning your first card, reaching 50 contacts, attending multiple exhibitions, and more. Each trophy is a badge of your networking hustle.</p>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <div className="text-4xl mb-3">⚡</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Climb the Leaderboard</h3>
              <p className="text-gray-600 text-sm">See how you stack up against other networkers. Rise through the ranks as you scan more cards and grow your contact base. Can you reach the top?</p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200 rounded-2xl p-6 text-center hover:shadow-lg transition-all">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Hit Milestones</h3>
              <p className="text-gray-600 text-sm">Every exhibition attended, every follow-up completed, every place shared — it all counts. Turn everyday networking tasks into satisfying wins.</p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center">Why CardScan Pro?</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Shield className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Your Privacy Matters</h3>
                <p className="text-blue-100">All contacts stored privately. Share only what you choose. Export anytime.</p>
              </div>
              <div className="text-center">
                <Smartphone className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Built for Travel</h3>
                <p className="text-blue-100">Perfect for exhibitions, trade shows, and business trips. Works offline.</p>
              </div>
              <div className="text-center">
                <Award className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">CRM Ready</h3>
                <p className="text-blue-100">Export to Excel for seamless import into Salesforce, HubSpot, or any CRM.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Turn Every Handshake Into Opportunity</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of professionals who never lose a connection. Start free today.</p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-12 py-6 shadow-lg"
          >
            Get Started Free
          </Button>
          <p className="text-sm text-gray-500 mt-4">No credit card required • Export to CRM • Your data stays private</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2026 CardScan Pro. All rights reserved.</p>
          <div className="mt-3 flex gap-4 justify-center text-sm">
            <Link to="/PrivacyPolicy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            <span className="text-gray-300">|</span>
            <a href="mailto:support@cardscanpro.com" className="text-blue-600 hover:underline">
              Contact Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}