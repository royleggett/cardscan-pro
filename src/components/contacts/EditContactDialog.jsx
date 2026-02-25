import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Save } from "lucide-react";
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
              <Textarea
                id="notes"
                value={formData.notes || ""}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                rows={3}
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