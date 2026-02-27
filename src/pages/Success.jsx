import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export default function Success() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate(createPageUrl("Home"));
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
            <Check className="w-10 h-10 text-white" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">Payment Successful!</h1>
        <p className="text-lg text-gray-600 mb-2">Thank you for your subscription.</p>
        <p className="text-gray-500 mb-8">Your plan is now active and you can enjoy all the premium features.</p>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-green-100 mb-8">
          <p className="text-sm text-gray-600 mb-2">Redirecting you back to home...</p>
          <p className="text-3xl font-bold text-green-600">{countdown}</p>
        </div>

        <Button
          onClick={() => navigate(createPageUrl("Home"))}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Go to Home Now
        </Button>
      </div>
    </div>
  );
}