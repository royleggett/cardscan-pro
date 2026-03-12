import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Save, Flame, Thermometer, Snowflake } from "lucide-react";
import VoiceNoteButton from "@/components/contacts/VoiceNoteButton";

export default function EditContactDialog({ open, onOpenChange, contact, onSave }) {
  const [formData, setFormData] = useState(contact);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(formData);
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="full_name">Full Name *</Label>
              <Input
                id="full_name"
                required
                value={formData.full_name || ""}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company || ""}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position || ""}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ""}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="country">Country/Area</Label>
              <Input
                id="country"
                value={formData.country || ""}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="phone_mobile">Mobile Phone</Label>
              <Input
                id="phone_mobile"
                value={formData.phone_mobile || ""}
                onChange={(e) => setFormData({...formData, phone_mobile: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="phone_landline">Landline</Label>
              <Input
                id="phone_landline"
                value={formData.phone_landline || ""}
                onChange={(e) => setFormData({...formData, phone_landline: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="phone_fax">Fax</Label>
              <Input
                id="phone_fax"
                value={formData.phone_fax || ""}
                onChange={(e) => setFormData({...formData, phone_fax: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="phone_other">Other Phone</Label>
              <Input
                id="phone_other"
                value={formData.phone_other || ""}
                onChange={(e) => setFormData({...formData, phone_other: e.target.value})}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={formData.website || ""}
                onChange={(e) => setFormData({...formData, website: e.target.value})}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <div className="flex gap-2 items-start">
                <Textarea
                  id="notes"
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
          </div>

          <div className="border-t pt-4 space-y-4">
            <h3 className="font-semibold text-gray-900">Follow-up Settings</h3>
            
            <div>
              <Label className="mb-3 block">Lead Temperature</Label>
              <div className="grid grid-cols-4 gap-2">
                <Button
                  type="button"
                  variant={formData.follow_up_type === "hot" ? "default" : "outline"}
                  onClick={() => setFormData({...formData, follow_up_type: "hot"})}
                  className={formData.follow_up_type === "hot" ? "bg-red-600 hover:bg-red-700" : ""}
                >
                  <Flame className="w-4 h-4 mr-1" />
                  Hot
                </Button>
                <Button
                  type="button"
                  variant={formData.follow_up_type === "warm" ? "default" : "outline"}
                  onClick={() => setFormData({...formData, follow_up_type: "warm"})}
                  className={formData.follow_up_type === "warm" ? "bg-amber-500 hover:bg-amber-600" : ""}
                >
                  <Thermometer className="w-4 h-4 mr-1" />
                  Warm
                </Button>
                <Button
                  type="button"
                  variant={formData.follow_up_type === "cool" ? "default" : "outline"}
                  onClick={() => setFormData({...formData, follow_up_type: "cool"})}
                  className={formData.follow_up_type === "cool" ? "bg-blue-500 hover:bg-blue-600" : ""}
                >
                  <Snowflake className="w-4 h-4 mr-1" />
                  Cool
                </Button>
                <Button
                  type="button"
                  variant={!formData.follow_up_type || formData.follow_up_type === "none" ? "default" : "outline"}
                  onClick={() => setFormData({...formData, follow_up_type: "none"})}
                >
                  None
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="thank_you_sent">Thank You Email Sent</Label>
                <p className="text-xs text-gray-500">Mark if you've sent a follow-up email</p>
              </div>
              <Switch
                id="thank_you_sent"
                checked={formData.thank_you_sent || false}
                onCheckedChange={(checked) => setFormData({...formData, thank_you_sent: checked})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="bg-blue-600 hover:bg-blue-700">
              {saving ? "Saving..." : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}