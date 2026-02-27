import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

export default function Exhibitions() {
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState([]);
  const [contactCounts, setContactCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadExhibitions();
  }, []);

  const loadExhibitions = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      // Load exhibitions created by the user OR where they are a team member
      const [owned, joined] = await Promise.all([
        base44.entities.Exhibition.filter({ created_by: currentUser.email }, "-created_date"),
        base44.entities.Exhibition.list("-created_date", 200)
      ]);

      // Merge: owned + exhibitions where user is in team_members (but not owner)
      const joinedAsTeam = joined.filter(
        ex => ex.created_by !== currentUser.email &&
        (ex.team_members || []).includes(currentUser.email)
      );

      const all = [...owned, ...joinedAsTeam];
      setExhibitions(all);
    } catch {
      base44.auth.redirectToLogin();
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Exhibitions</h1>
          <p className="text-gray-500 text-sm mt-1">{exhibitions.length} exhibition{exhibitions.length !== 1 ? "s" : ""}</p>
        </div>
        <Link to={createPageUrl("NewExhibition")}>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            New
          </Button>
        </Link>
      </div>

      {exhibitions.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No exhibitions yet</h3>
          <p className="text-gray-500 mb-6">Create your first exhibition to start scanning cards</p>
          <Link to={createPageUrl("NewExhibition")}>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Exhibition
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {exhibitions.map(ex => {
            const isOwner = ex.created_by === user?.email;
            return (
              <Card
                key={ex.id}
                className="cursor-pointer hover:shadow-lg hover:border-blue-200 border-2 transition-all"
                onClick={() => navigate(createPageUrl(`ExhibitionDetail?id=${ex.id}`))}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-lg text-gray-900">{ex.name}</h3>
                        {!isOwner && (
                          <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            Team
                          </Badge>
                        )}
                      </div>
                      {ex.location && (
                        <p className="text-sm text-gray-500 mt-1">📍 {ex.location}</p>
                      )}
                      {(ex.from_date || ex.to_date) && (
                        <p className="text-sm text-gray-500 mt-0.5">
                          📅 {ex.from_date ? format(new Date(ex.from_date), "MMM d, yyyy") : ""}
                          {ex.from_date && ex.to_date ? " – " : ""}
                          {ex.to_date ? format(new Date(ex.to_date), "MMM d, yyyy") : ""}
                        </p>
                      )}
                      {ex.hotel && (
                        <p className="text-sm text-gray-500 mt-0.5">🏨 {ex.hotel}</p>
                      )}
                    </div>
                    <div className="text-blue-400 ml-4">›</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}