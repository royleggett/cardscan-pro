import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";

export default function NewExhibition() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "", location: "", from_date: "", to_date: "", hotel: "", notes: ""
  });
  const [saving, setSaving] = useState(false);

  const generateTeamCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let code = "EXPO-";
    for (let i = 0; i < 4; i++) code += chars[Math.floor(Math.random() * chars.length)];
    return code;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const teamCode = generateTeamCode();
    const exhibition = await base44.entities.Exhibition.create({
      ...formData,
      team_code: teamCode,
      team_members: []
    });
    navigate(createPageUrl(`ExhibitionDetail?id=${exhibition.id}`));
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(createPageUrl("Exhibitions"))} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
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
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. London Trade Show 2026"
              />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={e => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. ExCeL London"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="from_date">Start Date</Label>
                <Input id="from_date" type="date" value={formData.from_date} onChange={e => setFormData({ ...formData, from_date: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="to_date">End Date</Label>
                <Input id="to_date" type="date" value={formData.to_date} onChange={e => setFormData({ ...formData, to_date: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="hotel">Hotel</Label>
              <Input id="hotel" value={formData.hotel} onChange={e => setFormData({ ...formData, hotel: e.target.value })} placeholder="e.g. Novotel London" />
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} />
            </div>
            <Button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700">
              <Save className="w-4 h-4 mr-2" />
              {saving ? "Creating..." : "Create Exhibition"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}