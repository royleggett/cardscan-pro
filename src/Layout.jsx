import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Home, FolderOpen, Users, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Layout({ children }) {
  const location = useLocation();
  
  const isActive = (path) => location.pathname.includes(path);

  const handleLogout = () => {
    base44.auth.logout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-20">
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            CardScanner Pro
          </h1>
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
        </div>
      </nav>
    </div>
  );
}