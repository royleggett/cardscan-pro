import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Trophy, Medal } from "lucide-react";

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);

      const allUsers = await base44.entities.User.list();
      const sorted = allUsers
        .filter(u => (u.total_entries || 0) > 0)
        .sort((a, b) => (b.total_entries || 0) - (a.total_entries || 0))
        .slice(0, 50);
      
      setLeaderboard(sorted);
    } catch (error) {
      console.error("Error loading leaderboard:", error);
      setLeaderboard([]);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank;
  };

  const getBadgeIcon = (discount) => {
    if (discount >= 20) return "💎";
    if (discount >= 10) return "🥇";
    return "⭐";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-24">
      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Top Contributors
          </h1>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-16">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500 opacity-70" />
            <p className="font-bold text-xl text-gray-800 mb-2">Welcome to the Leaderboard!</p>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              Track the top contributors in the CardScan-Pro community who help others by sharing places and scanning cards.
            </p>
            <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 max-w-md mx-auto text-left mb-4">
              <p className="font-semibold text-amber-900 mb-2">⚙️ First Time Setup Required:</p>
              <p className="text-sm text-amber-800 mb-3">
                Complete your profile in <strong>Settings</strong> to unlock leaderboard access and start earning rewards.
              </p>
              <Link to={createPageUrl("Settings")}>
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  Go to Settings
                </Button>
              </Link>
            </div>
            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 max-w-md mx-auto text-left">
              <p className="font-semibold text-blue-900 mb-2">🏆 How It Works:</p>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Earn points by scanning cards and adding places</li>
                <li>• Climb the leaderboard as you contribute</li>
                <li>• Unlock badges and exclusive rewards</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((user, index) => {
              const isCurrentUser = currentUser?.email === user.email;
              return (
                <div
                  key={user.id}
                  className={`rounded-xl p-4 border-2 transition-all ${
                    isCurrentUser
                      ? "bg-gradient-to-r from-blue-100 to-purple-100 border-blue-400 shadow-md"
                      : "bg-white border-gray-100 hover:shadow-md"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl font-bold w-8 text-center">
                        {getRankIcon(index + 1)}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">
                          {user.user_number || user.email.split("@")[0]}
                          {isCurrentUser && <span className="text-xs ml-2 text-blue-600">(You)</span>}
                        </p>
                        <p className="text-xs text-gray-500">
                          {user.badges_earned?.length > 0 && `${user.badges_earned.length} badges`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end mb-1">
                        <span className="text-2xl">{getBadgeIcon(user.discount_tier)}</span>
                      </div>
                      <p className="font-bold text-lg text-blue-600">{user.total_entries || 0}</p>
                      <p className="text-xs text-gray-500">entries</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}