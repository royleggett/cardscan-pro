import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, Users, Upload, Settings, Flame, Thermometer, Snowflake, AlertCircle, Compass, Star, MapPin, ChevronRight, UserPlus } from "lucide-react";
import JoinExhibitionDialog from "@/components/exhibitions/JoinExhibitionDialog";
import LandingPage from "@/components/LandingPage";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [followUpAlerts, setFollowUpAlerts] = useState([]);
  const [topPlaces, setTopPlaces] = useState([]);
  const [showJoin, setShowJoin] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      await Promise.all([loadFollowUpAlerts(currentUser), loadTopPlaces()]);
    } catch (err) {
      setLoading(false);
      return;
    }
    setLoading(false);
  };

  const loadTopPlaces = async () => {
    const places = await base44.entities.Place.filter({ is_public: true });
    const sorted = places.sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3);
    setTopPlaces(sorted);
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

  const handleJoined = () => {
    window.location.href = createPageUrl("Exhibitions");
  };

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
        
        {followUpAlerts.length > 0 && (
          <div className="max-w-md mx-auto mb-6">
            <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-amber-800 mb-2">
                    {followUpAlerts.length} lead{followUpAlerts.length !== 1 ? "s" : ""} need following up
                  </p>
                  <div className="space-y-1">
                    {followUpAlerts.slice(0, 3).map((alert, i) => {
                      const Icon = alert.type === "hot" ? Flame : alert.type === "warm" ? Thermometer : Snowflake;
                      const color = alert.type === "hot" ? "text-red-500" : alert.type === "warm" ? "text-amber-500" : "text-blue-400";
                      return (
                        <div key={i} className="flex items-center gap-2 text-sm text-amber-700">
                          <Icon className={`w-3.5 h-3.5 ${color}`} />
                          <span className="font-medium">{alert.contact.full_name}</span>
                          {alert.contact.company && <span className="text-amber-600">· {alert.contact.company}</span>}
                        </div>
                      );
                    })}
                    {followUpAlerts.length > 3 && (
                      <p className="text-xs text-amber-600 mt-1">+{followUpAlerts.length - 3} more</p>
                    )}
                  </div>
                  <Link to={createPageUrl("AllContacts")} className="inline-block mt-3">
                    <Button size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
                      View All Contacts
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Community Picks */}
        {topPlaces.length > 0 && (
          <div className="max-w-md mx-auto mb-6">
            <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🌍</span>
                  <span className="text-white font-bold">Community Picks</span>
                </div>
                <Link to={createPageUrl("Discover")} className="flex items-center gap-1 text-blue-100 text-xs font-medium hover:text-white">
                  See all <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="divide-y divide-gray-50">
                {topPlaces.map(place => (
                  <div key={place.id} className="px-4 py-3 flex items-center gap-3">
                    <div className="text-2xl">
                      {{"Restaurant":"🍽️","Bar":"🍺","Cafe":"☕","Hotel":"🏨","Tourist Attraction":"🏛️","Bakery":"🥐","Shopping":"🛍️","Supermarket":"🛒","Taxi Rank":"🚕"}[place.category] || "📍"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{place.name}</p>
                      {place.address && <p className="text-xs text-gray-400 truncate">{place.address}</p>}
                    </div>
                    {place.rating > 0 && (
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-bold text-gray-700">{place.rating}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                <Link to={createPageUrl("Discover")}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white gap-2">
                    <Compass className="w-4 h-4" />
                    Discover All Places
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        <div className="max-w-md mx-auto space-y-4">
          <Link to={createPageUrl("Exhibitions")} className="block w-full">
            <Button className="w-full h-20 text-lg justify-center bg-white hover:bg-gray-50 active:bg-blue-600 active:text-white text-gray-900 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <FolderOpen className="w-6 h-6 mr-3" />
              My Exhibitions
            </Button>
          </Link>
          
          <Link to={createPageUrl("NewExhibition")} className="block w-full">
            <Button className="w-full h-20 text-lg justify-center bg-white hover:bg-gray-50 active:bg-blue-600 active:text-white text-gray-900 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <Plus className="w-6 h-6 mr-3" />
              Create New Exhibition
            </Button>
          </Link>

          <Link to={createPageUrl("AllContacts")} className="block w-full">
            <Button className="w-full h-20 text-lg justify-center bg-white hover:bg-gray-50 active:bg-blue-600 active:text-white text-gray-900 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <Users className="w-6 h-6 mr-3" />
              View All Contacts
            </Button>
          </Link>

          <Link to={createPageUrl("ImportExport")} className="block w-full">
            <Button className="w-full h-20 text-lg justify-center bg-white hover:bg-gray-50 active:bg-blue-600 active:text-white text-gray-900 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <Upload className="w-6 h-6 mr-3" />
              Import / Export
            </Button>
          </Link>

          <Button
            onClick={() => setShowJoin(true)}
            className="w-full h-20 text-lg justify-center bg-white hover:bg-gray-50 active:bg-purple-600 active:text-white text-gray-900 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all"
          >
            <UserPlus className="w-6 h-6 mr-3" />
            Join Team Exhibition
          </Button>

          <Link to={createPageUrl("Settings")} className="block w-full">
            <Button className="w-full h-20 text-lg justify-center bg-white hover:bg-gray-50 active:bg-blue-600 active:text-white text-gray-900 border-2 border-gray-200 shadow-md hover:shadow-lg transition-all">
              <Settings className="w-6 h-6 mr-3" />
              Settings
            </Button>
          </Link>
        </div>
      </div>
      <JoinExhibitionDialog
        open={showJoin}
        onOpenChange={setShowJoin}
        onJoined={handleJoined}
      />
    </div>
  );
}