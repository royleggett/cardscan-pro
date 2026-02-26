import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Award, Copy, ChevronLeft, Zap, Target } from "lucide-react";

const MILESTONES = [
  { entries: 10, badge: "Starter", icon: "🌱" },
  { entries: 25, badge: "Contributor", icon: "⭐" },
  { entries: 50, badge: "Gold Member", icon: "🥇", discount: 10 },
  { entries: 75, badge: "Platinum", icon: "💎", discount: 20 }
];

export default function Rewards() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const currentUser = await base44.auth.me();
    setUser(currentUser);
    setLoading(false);
  };

  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  const nextMilestone = MILESTONES.find(m => m.entries > (user?.total_entries || 0));
  const entriesUntilNext = nextMilestone ? nextMilestone.entries - (user?.total_entries || 0) : 0;
  const progressPercent = nextMilestone 
    ? Math.min(100, ((user?.total_entries || 0) / nextMilestone.entries) * 100)
    : 100;

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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Your Rewards
          </h1>
        </div>

        {/* Current Stats */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 mb-6">
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium">Total Contributions</p>
            <p className="text-5xl font-bold text-blue-600 my-2">{user?.total_entries || 0}</p>
            <p className="text-gray-500 text-sm">
              {nextMilestone 
                ? `${entriesUntilNext} more to unlock ${nextMilestone.badge}`
                : "You've unlocked all milestones! 🎉"}
            </p>
          </div>

          {nextMilestone && (
            <div className="mt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-gray-600">{nextMilestone.badge}</span>
                <span className="text-xs font-semibold text-gray-600">{nextMilestone.entries}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Discount Code */}
        {user?.discount_tier > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border-2 border-yellow-200 p-6 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-yellow-600" />
              <h2 className="font-bold text-yellow-900">Active Discount</h2>
            </div>
            <p className="text-yellow-700 text-sm mb-4">
              {user.discount_tier}% off your yearly subscription
            </p>
            <div className="bg-white rounded-lg p-3 border border-yellow-200 flex justify-between items-center">
              <code className="font-mono font-bold text-gray-800">
                REWARD{user.discount_tier}
              </code>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyCode(`REWARD${user.discount_tier}`)}
                className="border-yellow-200 text-yellow-700 hover:bg-yellow-100"
              >
                <Copy className="w-4 h-4" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-blue-600" />
            <h2 className="font-bold text-gray-900">Badges & Milestones</h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {MILESTONES.map((milestone) => {
              const earned = (user?.total_entries || 0) >= milestone.entries;
              return (
                <div
                  key={milestone.badge}
                  className={`rounded-xl p-4 text-center border-2 transition-all ${
                    earned
                      ? "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-300"
                      : "bg-gray-50 border-gray-200 opacity-50"
                  }`}
                >
                  <div className="text-3xl mb-2">{milestone.icon}</div>
                  <p className="font-bold text-sm text-gray-900">{milestone.badge}</p>
                  <p className="text-xs text-gray-600">{milestone.entries} entries</p>
                  {milestone.discount && (
                    <p className="text-xs font-semibold text-green-600 mt-1">
                      {milestone.discount}% off
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* How to Earn */}
        <div className="bg-blue-50 rounded-2xl border border-blue-200 p-6">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-blue-900">How to Earn</h3>
          </div>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-lg">🏆</span>
              <span>Add places to the community</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lg">📇</span>
              <span>Scan and save business cards</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}