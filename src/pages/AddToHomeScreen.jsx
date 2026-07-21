import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share, MoreVertical, Smartphone, Check } from "lucide-react";

const IOS_VIDEO = "https://media.base44.com/videos/public/68e3b1d0b387a294f20142e9/3acc8029f_iphone-add-to-home.mp4";
const ANDROID_VIDEO = "https://media.base44.com/videos/public/68e3b1d0b387a294f20142e9/efd8979fa_android-add-to-home.mp4";

export default function AddToHomeScreen() {
  const navigate = useNavigate();
  const [platform, setPlatform] = useState("ios");
  const [autoDetected, setAutoDetected] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent;
    if (/Android/i.test(ua)) {
      setPlatform("android");
      setAutoDetected(true);
    } else if (/iPhone|iPad|iPod/i.test(ua)) {
      setPlatform("ios");
      setAutoDetected(true);
    }
  }, []);

  const iosSteps = [
    { icon: Share, text: "Tap the Share button at the bottom of Safari" },
    { text: 'Scroll down and tap "Add to Home Screen"' },
    { text: 'Tap "Add" to confirm' },
    { icon: Check, text: "CardScan-Pro now appears on your home screen!" },
  ];

  const androidSteps = [
    { icon: MoreVertical, text: "Tap the three-dot menu in the top right of Chrome" },
    { text: 'Tap "Add to Home screen"' },
    { text: 'Tap "Add" to confirm' },
    { icon: Check, text: "CardScan-Pro now appears on your home screen!" },
  ];

  const steps = platform === "ios" ? iosSteps : androidSteps;
  const videoUrl = platform === "ios" ? IOS_VIDEO : ANDROID_VIDEO;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pb-8">
      <div className="max-w-md mx-auto px-4 py-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-6 select-none"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Add to Home Screen</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get quick access to CardScan-Pro — it works just like an app!
          </p>
        </div>

        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
          <button
            onClick={() => setPlatform("ios")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all select-none ${
              platform === "ios"
                ? "bg-white dark:bg-gray-700 shadow-sm font-semibold text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            iPhone
          </button>
          <button
            onClick={() => setPlatform("android")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg transition-all select-none ${
              platform === "android"
                ? "bg-white dark:bg-gray-700 shadow-sm font-semibold text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Android
          </button>
        </div>

        {autoDetected && (
          <p className="text-center text-sm text-green-600 dark:text-green-400 mb-4">
            ✓ We detected you're on {platform === "ios" ? "an iPhone" : "an Android device"}
          </p>
        )}

        <div className="mb-8">
          <video
            src={videoUrl}
            controls
            playsInline
            preload="metadata"
            className="w-full rounded-2xl shadow-lg bg-black aspect-[9/16]"
          />
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
            Watch how it's done ↑
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Step-by-step guide
          </h2>
          <div className="space-y-4">
            {steps.map((step, i) => {
              const StepIcon = step.icon;
              const isLast = i === steps.length - 1;
              return (
                <div key={i} className="flex items-start gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                      isLast ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {isLast ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <div className="flex items-center gap-2 pt-1">
                    {StepIcon && <StepIcon className="w-5 h-5 text-gray-700 dark:text-gray-300 flex-shrink-0" />}
                    <p className="text-gray-700 dark:text-gray-300">{step.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
          <p className="text-sm text-blue-800 dark:text-blue-300">
            💡 <strong>Tip:</strong> Once installed, CardScan-Pro launches full screen — just like a
            native app. No App Store needed!
          </p>
        </div>

        <Button
          onClick={() => navigate(createPageUrl("Home"))}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg py-6"
        >
          I've Added It — Take Me Home
        </Button>
      </div>
    </div>
  );
}