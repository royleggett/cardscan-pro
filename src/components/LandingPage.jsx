import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Users, MapPin, Globe, Award, Zap, Shield, Smartphone } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function LandingPage() {
  const handleGetStarted = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto mb-16">
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
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-8 py-6 shadow-lg"
            >
              Get Started Free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="text-lg px-8 py-6 border-2"
              onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Feature Grid */}
        <div id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-xl transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Instant Scanning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Scan single or double-sided cards, QR codes, or upload images. AI extracts every detail instantly.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-xl transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Export to CRM</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Export your contacts to Excel for CRM import, reporting, or backup. Your data, your control.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-xl transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Places That Matter</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Save hotels, restaurants, venues. Share with the community or keep them private.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-xl transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Community Powered</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Discover places shared by professionals in your city or exhibition. Never eat alone.</p>
            </CardContent>
          </Card>
        </div>

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
              <h3 className="text-xl font-semibold mb-3">Export & Share</h3>
              <p className="text-gray-600">Export to Excel for CRM integration. Share places with your team or the community.</p>
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
        </div>
      </footer>
    </div>
  );
}