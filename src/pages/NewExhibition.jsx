import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { isDemoUser, showDemoRestriction } from "@/lib/demoMode";

const generateTeamCode = () => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "EXPO-";
  for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
};

export default function NewExhibition() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    from_date: "",
    to_date: "",
    hotel: "",
    notes: ""
  });
  const [isTeam, setIsTeam] = useState(false);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDemoUser(user)) {
      showDemoRestriction();
      return;
    }
    setSaving(true);
    const exhibition = await base44.entities.Exhibition.create({
      ...formData,
      ...(isTeam ? { team_code: generateTeamCode(), team_members: [user?.email] } : {})
    });
    navigate(createPageUrl(`ExhibitionDetail?id=${exhibition.id}`));
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create New Exhibition</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Exhibition Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. CES 2025"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Las Vegas, NV"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from_date">Start Date *</Label>
                <Input
                  id="from_date"
                  type="date"
                  required
                  value={formData.from_date}
                  onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="to_date">End Date *</Label>
                <Input
                  id="to_date"
                  type="date"
                  required
                  value={formData.to_date}
                  onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="hotel">Hotel</Label>
              <Input
                id="hotel"
                value={formData.hotel}
                onChange={(e) => setFormData({ ...formData, hotel: e.target.value })}
                placeholder="e.g. Marriott Downtown"
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Any additional notes..."
              />
            </div>

            {/* Team Exhibition toggle */}
            <div
              onClick={() => setIsTeam(!isTeam)}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                isTeam
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 bg-gray-50 hover:border-gray-300"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isTeam ? "bg-blue-600" : "bg-gray-300"}`}>
                <Users className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${isTeam ? "text-blue-800" : "text-gray-700"}`}>
                  Team Exhibition
                </p>
                <p className={`text-sm ${isTeam ? "text-blue-600" : "text-gray-500"}`}>
                  {isTeam
                    ? "A join link & code will be created — share with your team"
                    : "Tap to enable team sharing with a join link & code"}
                </p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isTeam ? "border-blue-500 bg-blue-500" : "border-gray-300"}`}>
                {isTeam && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700">
                {saving ? "Creating..." : "Create Exhibition"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}