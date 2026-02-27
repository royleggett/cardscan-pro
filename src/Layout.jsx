import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Home, FolderOpen, Users, LogOut, Settings, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }) {
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [logoTaps, setLogoTaps] = useState(0);
  const [showAdminFlash, setShowAdminFlash] = useState(false);
  const tapTimerRef = React.useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authenticated = await base44.auth.isAuthenticated();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        const user = await base44.auth.me();
        setIsAdmin(user?.role === "admin");
      }
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4 flex justify-between items-center">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e3b1d0b387a294f20142e9/bcdfcf951_CardScanPro_Icon.png" 
            alt="CardScanner Pro" 
            className={`h-10 w-10 cursor-pointer select-none transition-all ${showAdminFlash ? "opacity-30 scale-95" : "opacity-100 hover:scale-105"}`}
            onClick={handleLogoTap}
          />
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-900"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <main>{children}</main>

{isAuthenticated && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg">
          <div className="flex h-20 max-w-md mx-auto">
            <Link 
              to={createPageUrl("Home")} 
              className={`flex-1 flex flex-col items-center justify-center transition-all ${
                isActive("Home") 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Home className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Home</span>
            </Link>
            
            <Link 
              to={createPageUrl("Exhibitions")} 
              className={`flex-1 flex flex-col items-center justify-center transition-all ${
                isActive("Exhibition") 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <FolderOpen className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Exhibitions</span>
            </Link>
            
            <Link 
              to={createPageUrl("AllContacts")} 
              className={`flex-1 flex flex-col items-center justify-center transition-all ${
                isActive("AllContacts") 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Users className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Contacts</span>
            </Link>

            <Link 
              to={createPageUrl("Discover")} 
              className={`flex-1 flex flex-col items-center justify-center transition-all ${
                isActive("Discover") 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Compass className="w-6 h-6 mb-1" />
              <span className="text-xs font-medium">Discover</span>
            </Link>

            <Link 
              to={createPageUrl("Rewards")} 
              className={`flex-1 flex flex-col items-center justify-center transition-all ${
                isActive("Rewards") 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl mb-1">🏆</span>
              <span className="text-xs font-medium">Rewards</span>
            </Link>

            <Link 
              to={createPageUrl("Pricing")} 
              className={`flex-1 flex flex-col items-center justify-center transition-all ${
                isActive("Pricing") 
                  ? "text-blue-600 bg-blue-50" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="text-xl mb-1">💳</span>
              <span className="text-xs font-medium">Plans</span>
            </Link>

          </div>
        </nav>
      )}
    </div>
  );
}