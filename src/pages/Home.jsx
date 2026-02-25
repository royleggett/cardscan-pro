import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, Users, Upload, Settings, Flame, Thermometer, Snowflake, AlertCircle } from "lucide-react";
import LandingPage from "@/components/LandingPage";
import { base44 } from "@/api/base44Client";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followUpAlerts, setFollowUpAlerts] = useState([]);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      await loadFollowUpAlerts(currentUser);
    } catch (err) {
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  const loadFollowUpAlerts = async (currentUser) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const leadRules = [];
    if (currentUser?.followup_remind_hot ?? true) leadRules.push({ type: "hot", days: currentUser?.followup_days_hot ?? 1 });
    if (currentUser?.followup_remind_warm ?? true) leadRules.push({ type: "warm", days: currentUser?.followup_days_warm ?? 3 });
    if (currentUser?.followup_remind_cool ?? false) leadRules.push({ type: "cool", days: currentUser?.followup_days_cool ?? 7 });

    if (leadRules.length === 0) return;

    const [contacts, exhibitions] = await Promise.all([
      base44.entities.Contact.filter({ created_by: currentUser.email }),
      base44.entities.Exhibition.filter({ created_by: currentUser.email })
    ]);

    const exhibitionMap = {};
    exhibitions.forEach(ex => { exhibitionMap[ex.id] = ex; });

    const alerts = [];
    for (const contact of contacts) {
      if (!contact.follow_up_type || contact.follow_up_type === "none") continue;
      const rule = leadRules.find(r => r.type === contact.follow_up_type);
      if (!rule) continue;
      const exhibition = exhibitionMap[contact.exhibition_id];
      if (!exhibition?.to_date) continue;
      const exhibitionEnd = new Date(exhibition.to_date);
      exhibitionEnd.setHours(0, 0, 0, 0);
      const reminderDate = new Date(exhibitionEnd);
      reminderDate.setDate(reminderDate.getDate() + rule.days);
      if (reminderDate <= today) {
        alerts.push({ contact, exhibition, type: contact.follow_up_type });
      }
    }
    setFollowUpAlerts(alerts);
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

  // Show landing page for non-authenticated users
  if (!user) {
    return <LandingPage />;
  }

  // Show app dashboard for authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="px-4 py-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <img 
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/68e3b1d0b387a294f20142e9/bcdfcf951_CardScanPro_Icon.png" 
            alt="CardScanner Pro" 
            className="h-24 w-24 mx-auto mb-4"
          />
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
            <Button className="w-full h-20 text-lg bg-white hover:bg-gray-50 active:bg-blue-600 active:text-white text-gray-900 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <FolderOpen className="w-6 h-6 mr-3" />
              My Exhibitions
            </Button>
          </Link>
          
          <Link to={createPageUrl("NewExhibition")}>
            <Button className="w-full h-20 text-lg bg-white hover:bg-gray-50 active:bg-blue-600 active:text-white text-gray-900 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <Plus className="w-6 h-6 mr-3" />
              Create New Exhibition
            </Button>
          </Link>

          <Link to={createPageUrl("AllContacts")}>
            <Button className="w-full h-20 text-lg bg-white hover:bg-gray-50 active:bg-blue-600 active:text-white text-gray-900 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <Users className="w-6 h-6 mr-3" />
              View All Contacts
            </Button>
          </Link>

          <Link to={createPageUrl("ImportExport")}>
            <Button className="w-full h-20 text-lg bg-white hover:bg-gray-50 active:bg-blue-600 active:text-white text-gray-900 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <Upload className="w-6 h-6 mr-3" />
              Import / Export
            </Button>
          </Link>

          <Link to={createPageUrl("EmailSettings")}>
            <Button className="w-full h-20 text-lg bg-white hover:bg-gray-50 active:bg-blue-600 active:text-white text-gray-900 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <Mail className="w-6 h-6 mr-3" />
              Email Template
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}