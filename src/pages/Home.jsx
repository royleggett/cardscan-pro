import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, Users, Upload } from "lucide-react";
import LandingPage from "../components/LandingPage";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const isAuth = await base44.auth.isAuthenticated();
      if (isAuth) {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show landing page for non-logged-in users
  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            CardScanner Pro
          </h1>
          <p className="text-gray-600">Digitize your business cards instantly</p>
          {user && (
            <p className="text-sm text-gray-500 mt-4">
              Logged in as: {user.email}
            </p>
          )}
        </div>
        
        <div className="max-w-md mx-auto space-y-4">
          <Link to={createPageUrl("Exhibitions")}>
            <Button className="w-full h-20 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all">
              <FolderOpen className="w-6 h-6 mr-3" />
              My Exhibitions
            </Button>
          </Link>
          
          <Link to={createPageUrl("NewExhibition")}>
            <Button className="w-full h-20 text-lg bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <Plus className="w-6 h-6 mr-3" />
              Create New Exhibition
            </Button>
          </Link>

          <Link to={createPageUrl("AllContacts")}>
            <Button className="w-full h-20 text-lg bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <Users className="w-6 h-6 mr-3" />
              View All Contacts
            </Button>
          </Link>

          <Link to={createPageUrl("ImportExport")}>
            <Button className="w-full h-20 text-lg bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <Upload className="w-6 h-6 mr-3" />
              Import / Export
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}