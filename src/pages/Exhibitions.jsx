import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
const Exhibition = base44.entities.Exhibition;
const Contact = base44.entities.Contact;
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Calendar, MapPin, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import JoinExhibitionDialog from "../components/exhibitions/JoinExhibitionDialog";

export default function Exhibitions() {
  const [myExhibitions, setMyExhibitions] = useState([]);
  const [joinedExhibitions, setJoinedExhibitions] = useState([]);
  const [contactCounts, setContactCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [showJoin, setShowJoin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadExhibitions();
  }, []);

  const loadExhibitions = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);

      const [mine, allContacts] = await Promise.all([
        Exhibition.filter({ created_by: user.email }, "-created_date"),
        Contact.list("-created_date", 500)
      ]);

      // Find exhibitions the user has joined as a team member
      const allExhibitions = await Exhibition.list("-created_date", 200);
      const joined = allExhibitions.filter(ex =>
        ex.created_by !== user.email &&
        (ex.team_members || []).includes(user.email)
      );

      setMyExhibitions(mine);
      setJoinedExhibitions(joined);

      const counts = {};
      allContacts.forEach(c => {
        counts[c.exhibition_id] = (counts[c.exhibition_id] || 0) + 1;
      });
      setContactCounts(counts);
      setLoading(false);
    } catch (err) {
      base44.auth.redirectToLogin();
    }
  };

  const ExhibitionCard = ({ ex, isTeamMember = false }) => (
    <Link key={ex.id} to={createPageUrl(`ExhibitionDetail?id=${ex.id}`)}>
      <Card className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-blue-200">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-xl text-gray-900">{ex.name}</h3>
                {isTeamMember && (
                  <Badge className="bg-purple-100 text-purple-700 text-xs">
                    <Users className="w-3 h-3 mr-1" />
                    Team
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                {ex.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{ex.location}</span>
                  </div>
                )}
                {(ex.from_date || ex.to_date) && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {ex.from_date && new Date(ex.from_date).toLocaleDateString()}
                      {ex.from_date && ex.to_date && " - "}
                      {ex.to_date && new Date(ex.to_date).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <Badge className="bg-blue-100 text-blue-700 text-lg px-4 py-2">
              {contactCounts[ex.id] || 0} {contactCounts[ex.id] === 1 ? 'contact' : 'contacts'}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6">
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading exhibitions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Exhibitions</h1>
            <p className="text-gray-600 mt-1">{myExhibitions.length + joinedExhibitions.length} total</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowJoin(true)}
              className="border-purple-300 text-purple-700 hover:bg-purple-50"
            >
              <Users className="w-4 h-4 mr-2" />
              Join Team
            </Button>
            <Link to={createPageUrl("NewExhibition")}>
              <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                New
              </Button>
            </Link>
          </div>
        </div>

        {/* My Exhibitions */}
        {myExhibitions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">My Exhibitions</h2>
            <div className="grid gap-4">
              {myExhibitions.map(ex => <ExhibitionCard key={ex.id} ex={ex} />)}
            </div>
          </div>
        )}

        {/* Joined Team Exhibitions */}
        {joinedExhibitions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Team Exhibitions</h2>
            <div className="grid gap-4">
              {joinedExhibitions.map(ex => <ExhibitionCard key={ex.id} ex={ex} isTeamMember />)}
            </div>
          </div>
        )}

        {myExhibitions.length === 0 && joinedExhibitions.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No exhibitions yet</h3>
            <p className="text-gray-500 mb-6">Create your first exhibition or join a team with a code</p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => setShowJoin(true)} className="border-purple-300 text-purple-700">
                <Users className="w-4 h-4 mr-2" />
                Join Team
              </Button>
              <Link to={createPageUrl("NewExhibition")}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Exhibition
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>

      <JoinExhibitionDialog
        open={showJoin}
        onOpenChange={setShowJoin}
        onJoined={loadExhibitions}
      />
    </div>
  );
}