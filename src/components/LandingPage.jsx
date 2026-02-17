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
            The Smart Way to Network at Exhibitions
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Never Lose a
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Business Card </span>
            Again
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Scan business cards instantly, discover the best local spots, and build meaningful connections at every exhibition you attend.
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
              <p className="text-gray-600">Scan business cards with your phone camera. AI extracts all contact details automatically.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-xl transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <CardTitle>Community Places</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Discover restaurants and attractions recommended by other exhibition attendees.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-xl transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                <MapPin className="w-6 h-6 text-orange-600" />
              </div>
              <CardTitle>Local Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Get matched with places based on your exhibition location. Know where to eat, stay, and explore.</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-2 hover:shadow-xl transition-all">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Globe className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Multi-Event</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Organize contacts and places by exhibition. Perfect for frequent travelers and exhibitors.</p>
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
              <h3 className="text-xl font-semibold mb-3">Create Your Exhibition</h3>
              <p className="text-gray-600">Add the exhibition or event you're attending with location and dates.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Scan & Save</h3>
              <p className="text-gray-600">Scan business cards and add your favorite places as you discover them.</p>
            </div>
            <div>
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Connect & Share</h3>
              <p className="text-gray-600">Access your contacts anytime and discover community recommendations.</p>
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
                <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
                <p className="text-blue-100">Your data is encrypted and protected. You control what you share.</p>
              </div>
              <div className="text-center">
                <Smartphone className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Mobile First</h3>
                <p className="text-blue-100">Works perfectly on any device. Add to your home screen for quick access.</p>
              </div>
              <div className="text-center">
                <Award className="w-12 h-12 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
                <p className="text-blue-100">Benefit from the collective knowledge of exhibition attendees worldwide.</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Transform Your Networking?</h2>
          <p className="text-xl text-gray-600 mb-8">Join professionals who never miss a connection.</p>
          <Button 
            onClick={handleGetStarted}
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-lg px-12 py-6 shadow-lg"
          >
            Start Scanning Now - It's Free
          </Button>
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