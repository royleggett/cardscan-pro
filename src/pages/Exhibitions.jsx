import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Plus, FolderOpen, ArrowLeft, MapPin, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import JoinExhibitionDialog from "@/components/exhibitions/JoinExhibitionDialog";

export default function Exhibitions() {
  const navigate = useNavigate();
  const [exhibitions, setExhibitions] = useState([]);
  const [teamExhibitions, setTeamExhibitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showJoin, setShowJoin] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const user = await base44.auth.me();
    setCurrentUser(user);
    const [owned, all] = await Promise.all([
      base44.entities.Exhibition.filter({ created_by: user.email }, "-created_date"),
      base44.entities.Exhibition.list("-created_date")
    ]);
    setExhibitions(owned);
    const joined = all.filter(ex =>
      ex.created_by !== user.email &&
      (ex.team_members || []).includes(user.email)
    );
    setTeamExhibitions(joined);
    setLoading(false);
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  };

  const ExhibitionCard = ({ ex, isTeam }) => (
    <Card
      key={ex.id}
      className="bg-white hover:shadow-lg transition-all cursor-pointer border-2 hover:border-blue-200"
      onClick={() => navigate(createPageUrl(`ExhibitionDetail?id=${ex.id}`))}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg text-gray-900">{ex.name}</h3>
          {isTeam && (
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-semibold flex items-center gap-1">
              <Users className="w-3 h-3" /> Team
            </span>
          )}
        </div>
        {ex.location && (
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3.5 h-3.5" /> {ex.location}
          </p>
        )}
        {(ex.from_date || ex.to_date) && (
          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(ex.from_date)}{ex.to_date && ex.from_date !== ex.to_date ? ` – ${formatDate(ex.to_date)}` : ""}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(createPageUrl("Home"))} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Exhibitions</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowJoin(true)} className="gap-2">
            <Users className="w-4 h-4" /> Join Team
          </Button>
          <Button onClick={() => navigate(createPageUrl("NewExhibition"))} className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" /> New
          </Button>
        </div>
      </div>

      {exhibitions.length === 0 && teamExhibitions.length === 0 && (
        <div className="text-center py-16">
          <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No exhibitions yet</h3>
          <p className="text-gray-500 mb-6">Create your first exhibition or join a team one.</p>
          <Button onClick={() => navigate(createPageUrl("NewExhibition"))} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" /> Create Exhibition
          </Button>
        </div>
      )}

      {exhibitions.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">My Exhibitions</h2>
          <div className="space-y-3 mb-6">
            {exhibitions.map(ex => <ExhibitionCard key={ex.id} ex={ex} isTeam={false} />)}
          </div>
        </>
      )}

      {teamExhibitions.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Team Exhibitions</h2>
          <div className="space-y-3">
            {teamExhibitions.map(ex => <ExhibitionCard key={ex.id} ex={ex} isTeam={true} />)}
          </div>
        </>
      )}

      <JoinExhibitionDialog
        open={showJoin}
        onOpenChange={setShowJoin}
        onJoined={loadData}
      />
    </div>
  );
}