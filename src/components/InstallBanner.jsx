import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Smartphone, X } from "lucide-react";

export default function InstallBanner() {
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

    // Respect dismissal (expires after 7 days)
    const dismissed = localStorage.getItem("install_banner_dismissed");
    if (dismissed) {
      const dismissedAt = parseInt(dismissed, 10);
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      if (Date.now() - dismissedAt < sevenDays) return;
    }

    setVisible(true);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    localStorage.setItem("install_banner_dismissed", String(Date.now()));
  };

  const handleInstall = () => {
    navigate(createPageUrl("AddToHomeScreen"));
  };

  if (!visible) return null;

  return (
    <div className="sticky top-0 z-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md select-none">
      <div className="max-w-md mx-auto px-4 py-2.5 flex items-center gap-3">
        <div className="bg-white/20 rounded-lg p-1.5 flex-shrink-0">
          <Smartphone className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight">Get the full app experience</p>
          <p className="text-xs text-blue-100 leading-tight">Add CardScan-Pro to your Home Screen</p>
        </div>
        <button
          onClick={handleInstall}
          className="bg-white text-blue-600 hover:bg-blue-50 text-sm font-bold px-4 py-1.5 rounded-lg flex-shrink-0"
        >
          Install
        </button>
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