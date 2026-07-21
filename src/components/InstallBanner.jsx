import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function InstallBanner({ bottomClass = "bottom-24" }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Don't show if already installed (standalone mode)
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;
    if (standalone) return;

    // Only show on mobile devices
    const isMobile = /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) return;

    // Respect dismissal
    if (localStorage.getItem("install_banner_dismissed")) return;

    const timer = setTimeout(() => setVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem("install_banner_dismissed", "true");
  };

  const handleInstall = () => {
    navigate(createPageUrl("AddToHomeScreen"));
  };

  if (!visible) return null;

  return (
    <div className={`fixed ${bottomClass} left-4 right-4 z-50 max-w-md mx-auto`}>
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl p-4 flex items-center gap-3">
        <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
          <Smartphone className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm">Add CardScan-Pro to your Home Screen</p>
          <p className="text-xs text-blue-100">Quick access — just like an app</p>
        </div>
        <Button
          size="sm"
          onClick={handleInstall}
          className="bg-white text-blue-600 hover:bg-blue-50 flex-shrink-0"
        >
          Show Me How
        </Button>
        <button
          onClick={handleDismiss}
          className="text-white/70 hover:text-white flex-shrink-0 p-1"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}