import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, AlertCircle } from "lucide-react";

const MILESTONES = [
  { entries: 25, badge: "Starter" },
  { entries: 50, badge: "Contributor" },
  { entries: 75, badge: "Bronze Member", discount: 5 },
  { entries: 100, badge: "Silver Member", discount: 5 },
  { entries: 150, badge: "Gold Member", discount: 10 },
  { entries: 200, badge: "Platinum", discount: 20 },
  { entries: 500, badge: "Elite", discount: 50 },
  { entries: 1000, badge: "VIP", subscription: "free_year" }
];

export default function AdminRewards() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    checkAdminAndLoadUsers();
  }, []);

  const checkAdminAndLoadUsers = async () => {
    const user = await base44.auth.me();
    if (user?.role !== "admin") {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setIsAdmin(true);

    const allUsers = await base44.entities.User.list();
    const sortedUsers = allUsers.sort((a, b) => (b.total_entries || 0) - (a.total_entries || 0));
    setUsers(sortedUsers);
    setLoading(false);
  };

  const getNextMilestone = (entries) => {
    return MILESTONES.find(m => m.entries > entries);
  };

  const isNearMilestone = (entries) => {
    const nextMilestone = getNextMilestone(entries);
    if (!nextMilestone) return false;
    const entriesNeeded = nextMilestone.entries - entries;
    return entriesNeeded <= 10;
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

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-6">You must be an admin to view this page.</p>
          <Link to={createPageUrl("Home")}>
            <Button>Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 pb-24">
      <div className="px-4 py-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" size="icon">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        </div>

        {/* Admin Nav Links */}
        <div className="flex flex-wrap gap-3 mb-8">
          <Link to={createPageUrl("AdminUsers")}>
            <Button variant="outline">👥 Manage Users</Button>
          </Link>
          <Link to={createPageUrl("AdminPlaces")}>
            <Button variant="outline">📍 Moderate Places</Button>
          </Link>
        </div>

        <h2 className="text-xl font-bold text-gray-900 mb-4">User Rewards Monitor</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <p className="text-gray-600 text-sm">Total Users</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{users.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <p className="text-gray-600 text-sm">Active Contributors</p>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {users.filter(u => (u.total_entries || 0) > 0).length}
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
            <p className="text-gray-600 text-sm">Near Next Tier</p>
            <p className="text-4xl font-bold text-orange-600 mt-2">
              {users.filter(u => isNearMilestone(u.total_entries || 0)).length}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Entries</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Current Tier</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Next Tier</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Progress</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Discount</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const entries = user.total_entries || 0;
                  const currentTier = [...MILESTONES].reverse().find(m => entries >= m.entries);
                  const nextTier = getNextMilestone(entries);
                  const nearMilestone = isNearMilestone(entries);
                  const progressPercent = nextTier
                    ? Math.min(100, ((entries / nextTier.entries) * 100))
                    : 100;

                  return (
                    <tr
                      key={user.id}
                      className={`border-t border-gray-100 ${
                        nearMilestone ? "bg-orange-50" : "hover:bg-gray-50"
                      } transition-colors`}
                    >
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-medium text-gray-900">{user.user_number || user.email.split("@")[0]}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">{entries}</td>
                      <td className="px-6 py-4 text-sm">
                        {currentTier ? (
                          <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {currentTier.badge}
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {nextTier ? (
                          <span className="text-gray-700">{nextTier.badge}</span>
                        ) : (
                          <span className="text-gray-500">Max</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {nextTier ? (
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  nearMilestone ? "bg-orange-500" : "bg-blue-500"
                                }`}
                                style={{ width: `${progressPercent}%` }}
                              />
                            </div>
                            <span className="text-xs font-medium text-gray-600">
                              {nextTier.entries - entries} left
                            </span>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">Complete</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {user.discount_tier > 0 ? (
                          <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                            {user.discount_tier}% off
                          </span>
                        ) : user.subscription_status === "free_year" ? (
                          <span className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-semibold">
                            Free Year
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}