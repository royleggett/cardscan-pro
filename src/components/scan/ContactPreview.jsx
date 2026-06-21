import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, AlertCircle, ExternalLink, Linkedin } from "lucide-react";
import VoiceNoteButton from "@/components/contacts/VoiceNoteButton";

export default function ContactPreview({ data, imageUrl, imageBackUrl, onSave, onCancel }) {
  const [formData, setFormData] = useState(data);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Review Contact</CardTitle>
        </CardHeader>
        <CardContent>
          {imageUrl && (
            <div className="mb-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">Card Front:</p>
                <img src={imageUrl} alt="Card Front" className="w-full rounded-lg border" />
              </div>
              {imageBackUrl && (
                <div>
                  <p className="text-xs text-gray-500 mb-2">Card Back:</p>
                  <img src={imageBackUrl} alt="Card Back" className="w-full rounded-lg border" />
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* No email found warning */}
            {!(formData.email || "").trim() && (
              <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 animate-pulse">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-amber-900">No email found</p>
                    <p className="text-sm text-amber-800 mt-1">
                      This contact's email couldn't be extracted automatically. Ask them for their email address and type it in below.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* LinkedIn profile link */}
            {(formData.website || "").toLowerCase().includes("linkedin.com") && (
              <a
                href={formData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white rounded-lg py-2.5 px-4 text-sm font-medium transition-colors"
              >
                <Linkedin className="w-4 h-4" />
                View LinkedIn Profile
                <ExternalLink className="w-3.5 h-3.5 ml-1" />
              </a>
            )}

            <div>
              <Label>Full Name</Label>
              <Input value={formData.full_name || ""} onChange={(e) => setFormData({...formData, full_name: e.target.value})} />
            </div>
            <div>
              <Label>Company</Label>
              <Input value={formData.company || ""} onChange={(e) => setFormData({...formData, company: e.target.value})} />
            </div>
            <div>
              <Label>Position</Label>
              <Input value={formData.position || ""} onChange={(e) => setFormData({...formData, position: e.target.value})} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={formData.email || ""} onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
            <div>
              <Label>Mobile Phone</Label>
              <Input value={formData.phone_mobile || ""} onChange={(e) => setFormData({...formData, phone_mobile: e.target.value})} />
            </div>
            <div>
              <Label>Landline</Label>
              <Input value={formData.phone_landline || ""} onChange={(e) => setFormData({...formData, phone_landline: e.target.value})} />
            </div>
            <div>
              <Label>Country/Area</Label>
              <Input value={formData.country || ""} onChange={(e) => setFormData({...formData, country: e.target.value})} />
            </div>
            <div>
              <Label>Website</Label>
              <Input value={formData.website || ""} onChange={(e) => setFormData({...formData, website: e.target.value})} />
            </div>
            <div>
              <Label>Address</Label>
              <Input value={formData.address || ""} onChange={(e) => setFormData({...formData, address: e.target.value})} />
            </div>
            <div>
              <Label>Notes</Label>
              <div className="flex gap-2 items-start">
                <Textarea
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="flex-1"
                />
                <VoiceNoteButton
                  onTranscript={(text) =>
                    setFormData((prev) => ({
                      ...prev,
                      notes: prev.notes ? prev.notes + " " + text : text,
                    }))
                  }
                />
              </div>
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancel</Button>
              <Button type="submit" disabled={saving} className="flex-1 bg-blue-600">
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}