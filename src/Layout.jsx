import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Home, FolderOpen, Users, LogOut, Compass, HelpCircle, Menu, Trophy, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export default function Layout({ children }) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [logoTaps, setLogoTaps] = useState(0);
  const [showAdminFlash, setShowAdminFlash] = useState(false);
  const [loading, setLoading] = useState(true);
  const [moreSheetOpen, setMoreSheetOpen] = useState(false);
  const tapTimerRef = useRef(null);

  // Auto-detect system dark mode
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const applyTheme = (e) => {
      document.documentElement.classList.toggle('dark', e.matches);
    };
    applyTheme(mq);
    mq.addEventListener('change', applyTheme);
    return () => mq.removeEventListener('change', applyTheme);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === "admin");
      }
      setLoading(false);
    };
    checkAuth();
  }, [location]);

  const handleLogoTap = () => {
    if (!isAdmin) return;
    const newCount = logoTaps + 1;
    setLogoTaps(newCount);
    clearTimeout(tapTimerRef.current);
    if (newCount >= 3) {
      setLogoTaps(0);
      setShowAdminFlash(true);
      setTimeout(() => setShowAdminFlash(false), 300);
      setTimeout(() => {
        window.location.href = createPageUrl("AdminRewards");
      }, 150);
    } else {
      tapTimerRef.current = setTimeout(() => setLogoTaps(0), 3000);
    }
  };

  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = () => {
    base44.auth.logout();
    base44.auth.redirectToLogin();
  };

  const handleLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  const isSuccessPage = location.pathname.includes("Success");

  const moreItems = [
    { label: "Rewards", icon: Trophy, path: "Rewards" },
    { label: "Plans", icon: CreditCard, path: "Pricing" },
    { label: "Help", icon: HelpCircle, path: "Help" },
  ];

  const moreActive = isActive("Rewards") || isActive("Pricing") || isActive("Help");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {!isSuccessPage && (
        <header
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10 shadow-sm"
          style={{ paddingTop: 'env(safe-area-inset-top)' }}
        >
          <div className="px-4 py-4 flex justify-between items-center">
            <img
              src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e3b1d0b387a294f20142e9/bcdfcf951_CardScanPro_Icon.png"
              alt="CardScanner Pro"
              className={`h-10 w-10 cursor-pointer select-none transition-all ${showAdminFlash ? "opacity-30 scale-95" : "opacity-100 hover:scale-105"}`}
              onClick={handleLogoTap}
            />
            {!loading && (
              isAuthenticated ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogin}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Login
                </Button>
              )
            )}
          </div>
        </header>
      )}

      <main className={isSuccessPage ? "min-h-screen" : ""}>{children}</main>

      {!isSuccessPage && isAuthenticated && (
        <nav
          className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 shadow-lg"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div className="flex h-20 max-w-md mx-auto">
            <Link
              to={createPageUrl("Home")}
              className={`flex-1 flex flex-col items-center justify-center transition-all select-none ${
                isActive("Home")
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Home className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Home</span>
            </Link>

            <Link
              to={createPageUrl("Exhibitions")}
              className={`flex-1 flex flex-col items-center justify-center transition-all select-none ${
                isActive("Exhibition")
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <FolderOpen className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Exhibitions</span>
            </Link>

            <Link
              to={createPageUrl("AllContacts")}
              className={`flex-1 flex flex-col items-center justify-center transition-all select-none ${
                isActive("AllContacts")
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Users className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Contacts</span>
            </Link>

            <Link
              to={createPageUrl("Discover")}
              className={`flex-1 flex flex-col items-center justify-center transition-all select-none ${
                isActive("Discover")
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Compass className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Discover</span>
            </Link>

            <button
              onClick={() => setMoreSheetOpen(true)}
              className={`flex-1 flex flex-col items-center justify-center transition-all select-none ${
                moreActive
                  ? "text-blue-600 bg-blue-50 dark:bg-blue-900/30"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
            >
              <Menu className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">More</span>
            </button>
          </div>
        </nav>
      )}

      <Sheet open={moreSheetOpen} onOpenChange={setMoreSheetOpen}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>More</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-2">
            {moreItems.map(({ label, icon: Icon, path }) => (
              <Link
                key={path}
                to={createPageUrl(path)}
                onClick={() => setMoreSheetOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all select-none ${
                  isActive(path)
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}