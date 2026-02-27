import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

const plans = [
  {
    tier: "free",
    name: "Free",
    price: "£0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Scan up to 10 business cards",
      "View all scanned contacts",
      "Access to Discover Places (read-only)",
      "Basic lead tracking"
    ],
    cta: "Current Plan",
    featured: false
  },
  {
    tier: "places",
    name: "Places",
    price: "£20",
    period: "per year",
    description: "For explorers",
    features: [
      "Everything in Free",
      "Unlimited access to Discover Places",
      "View community recommendations",
      "Curated local spots"
    ],
    cta: "Subscribe",
    featured: false
  },
  {
    tier: "premium",
    name: "Premium",
    price: "£59",
    period: "per year",
    description: "For networkers",
    features: [
      "Unlimited card scanning",
      "Team collaborations",
      "Exhibition management",
      "Advanced lead tracking & analytics",
      "Unlimited Discover Places access",
      "Export & backup contacts",
      "Email reminders"
    ],
    cta: "Subscribe",
    featured: true
  }
];

export default function Pricing() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (err) {
        console.error("Failed to load user:", err);
        base44.auth.redirectToLogin();
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  const handleSubscribe = async (tier) => {
    if (tier === "free") return;
    
    setLoading(true);
    try {
      // Call backend to create Stripe checkout session
      const response = await base44.functions.invoke("createCheckoutSession", {
        tier,
        userEmail: user.email,
        userName: user.full_name
      });
      
      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        console.error("No checkout URL returned");
      }
    } catch (err) {
      console.error("Failed to create checkout session:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const currentTier = user?.subscription_tier || "free";

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6">
      <Button
        variant="ghost"
        onClick={() => navigate(createPageUrl("Home"))}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that fits your networking needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.tier}
              className={`relative flex flex-col transition-all ${
                plan.featured ? "md:scale-105 ring-2 ring-blue-600 shadow-xl" : "hover:shadow-lg"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600 ml-2">/{plan.period}</span>
                </div>
              </CardHeader>

              <CardContent className="flex-grow">
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  onClick={() => handleSubscribe(plan.tier)}
                  disabled={currentTier === plan.tier || loading}
                  className={`w-full ${
                    plan.featured ? "bg-blue-600 hover:bg-blue-700" : ""
                  }`}
                  variant={currentTier === plan.tier ? "outline" : "default"}
                >
                  {currentTier === plan.tier ? plan.cta : plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-xl p-8 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Frequently Asked Questions</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I change my plan anytime?</h4>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your subscription at any time. Changes take effect at the next billing cycle.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-600">We accept all major credit and debit cards through Stripe.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h4>
              <p className="text-gray-600">Yes! Free plan users get unlimited time to scan up to 10 cards before needing to upgrade.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h4>
              <p className="text-gray-600">Of course. Cancel your subscription anytime without penalties. Your data stays with you.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}