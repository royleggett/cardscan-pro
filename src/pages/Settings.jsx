import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save, RotateCcw, Flame, Thermometer, Snowflake, Plus, X, Trash2, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { isDemoUser, showDemoRestriction } from "@/lib/demoMode";

const DEFAULT_SUBJECT = `Thank you for visiting us at {exhibition_name}`;
const DEFAULT_BODY = `Dear {contact_name},

Thank you for visiting us at {exhibition_name}. It was a pleasure meeting you!

We hope you enjoyed the event and found our time together valuable. We will be in touch soon.

Warm regards,
{sender_name}`;

export default function Settings() {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [defaultTags, setDefaultTags] = useState([]);
  const [newDefaultTag, setNewDefaultTag] = useState("");

  // Follow-up reminder settings
  const [remindHot, setRemindHot] = useState(true);
  const [remindWarm, setRemindWarm] = useState(true);
  const [remindCool, setRemindCool] = useState(false);
  const [daysHot, setDaysHot] = useState(1);
  const [daysWarm, setDaysWarm] = useState(3);
  const [daysCool, setDaysCool] = useState(7);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    const user = await base44.auth.me();
    const templates = await base44.entities.EmailTemplate.filter({ template_key: "thank_you" });
    if (templates.length > 0) {
      setSubject(templates[0].subject);
      setBody(templates[0].body);
    }
    setDisplayName(user?.display_name || "");
    setDefaultTags(user?.default_tags || []);
    setRemindHot(user?.followup_remind_hot ?? true);
    setRemindWarm(user?.followup_remind_warm ?? true);
    setRemindCool(user?.followup_remind_cool ?? false);
    setDaysHot(user?.followup_days_hot ?? 1);
    setDaysWarm(user?.followup_days_warm ?? 3);
    setDaysCool(user?.followup_days_cool ?? 7);
    setLoading(false);
  };

  const handleSave = async () => {
    const user = await base44.auth.me();
    if (isDemoUser(user)) {
      showDemoRestriction();
      return;
    }
    setSaving(true);
    const templates = await base44.entities.EmailTemplate.filter({ template_key: "thank_you" });
    if (templates.length > 0) {
      await base44.entities.EmailTemplate.update(templates[0].id, { subject, body });
    } else {
      await base44.entities.EmailTemplate.create({ template_key: "thank_you", subject, body });
    }

    await base44.auth.updateMe({
      display_name: displayName,
      followup_remind_hot: remindHot,
      followup_remind_warm: remindWarm,
      followup_remind_cool: remindCool,
      followup_days_hot: Number(daysHot),
      followup_days_warm: Number(daysWarm),
      followup_days_cool: Number(daysCool),
      default_tags: defaultTags,
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setSubject(DEFAULT_SUBJECT);
    setBody(DEFAULT_BODY);
  };

  const handleAddDefaultTag = async () => {
    const user = await base44.auth.me();
    if (isDemoUser(user)) {
      showDemoRestriction();
      return;
    }
    const t = newDefaultTag.trim();
    if (!t || defaultTags.includes(t)) { setNewDefaultTag(""); return; }
    const updated = [...defaultTags, t];
    setDefaultTags(updated);
    setNewDefaultTag("");
    await base44.auth.updateMe({ default_tags: updated });
  };

  const handleRemoveDefaultTag = async (tag) => {
    const user = await base44.auth.me();
    if (isDemoUser(user)) {
      showDemoRestriction();
      return;
    }
    const updated = defaultTags.filter(t => t !== tag);
    setDefaultTags(updated);
    await base44.auth.updateMe({ default_tags: updated });
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    setDeleting(true);
    setDeleteError("");
    try {
      const user = await base44.auth.me();
      const contacts = await base44.entities.Contact.filter({ created_by: user.email });
      await Promise.all(contacts.map(c => base44.entities.Contact.delete(c.id)));
      const exhibitions = await base44.entities.Exhibition.filter({ created_by: user.email });
      await Promise.all(exhibitions.map(e => base44.entities.Exhibition.delete(e.id)));
      const places = await base44.entities.Place.filter({ created_by: user.email });
      await Promise.all(places.map(p => base44.entities.Place.delete(p.id)));
      setDeleting(false);
      setShowDeleteDialog(false);
      base44.auth.logout();
    } catch (err) {
      setDeleting(false);
      setDeleteError("Something went wrong. Please try again or contact support.");
    }
  };

  const LeadRow = ({ icon: Icon, iconColor, label, enabled, onToggle, days, onDaysChange }) => (
    <div className={`rounded-xl border-2 p-4 transition-all ${enabled ? "border-current opacity-100" : "border-gray-200 opacity-60"}`} style={{ borderColor: enabled ? undefined : undefined }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          <span className="font-semibold text-gray-800">{label} Leads</span>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} />
      </div>
      {enabled && (
        <div className="flex items-center gap-3">
          <Label className="text-sm text-gray-600 whitespace-nowrap">Remind after</Label>
          <Input
            type="number"
            min="1"
            max="30"
            value={days}
            onChange={e => onDaysChange(e.target.value)}
            className="w-20 text-center"
          />
          <span className="text-sm text-gray-600">day{days !== 1 ? "s" : ""} after exhibition ends</span>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

        {/* Follow-up Reminders */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Follow-up Reminders</CardTitle>
            <CardDescription>
              Choose which lead types to be reminded about, and when. You'll receive a reminder email listing the contacts that need following up.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : (
              <>
                <LeadRow
                  icon={Flame} iconColor="text-red-500" label="Hot"
                  enabled={remindHot} onToggle={setRemindHot}
                  days={daysHot} onDaysChange={setDaysHot}
                />
                <LeadRow
                  icon={Thermometer} iconColor="text-amber-500" label="Warm"
                  enabled={remindWarm} onToggle={setRemindWarm}
                  days={daysWarm} onDaysChange={setDaysWarm}
                />
                <p className="text-xs text-gray-400 pt-1">
                  Reminders are sent to your registered email address each morning.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Default Tags */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Default Tags</CardTitle>
            <CardDescription>
              Add tags here to quickly apply them to any contact. These also export in the CSV.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap mb-3">
              {defaultTags.map(tag => (
                <span key={tag} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border-2 border-purple-300">
                  {tag}
                  <button
                    onClick={() => handleRemoveDefaultTag(tag)}
                    className="ml-0.5 hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {defaultTags.length === 0 && (
                <p className="text-sm text-gray-400">No default tags yet.</p>
              )}
            </div>
            <div className="flex gap-2">
              <Input
                value={newDefaultTag}
                onChange={e => setNewDefaultTag(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") handleAddDefaultTag(); }}
                placeholder="New tag name..."
                className="h-9 text-sm"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddDefaultTag}
                disabled={!newDefaultTag.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Your Name */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Your Name</CardTitle>
            <CardDescription>
              This is used as the sender name in emails (the {"{sender_name}"} placeholder).
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4 text-gray-400">Loading...</div>
            ) : (
              <Input
                type="text"
                placeholder="e.g. Jane Smith"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
              />
            )}
          </CardContent>
        </Card>

        {/* Email Template */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Thank You Email Template</CardTitle>
            <CardDescription>
              Customise the email sent to contacts after scanning their card.
            </CardDescription>
            <div className="flex flex-wrap gap-2 mt-2">
              {["{contact_name}", "{exhibition_name}", "{sender_name}"].map(p => (
                <span key={p} className="bg-blue-100 text-blue-700 text-xs font-mono px-2 py-1 rounded">
                  {p}
                </span>
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : (
              <>
                <div>
                  <Label className="mb-1 block">Subject</Label>
                  <Input value={subject} onChange={e => setSubject(e.target.value)} />
                </div>
                <div>
                  <Label className="mb-1 block">Body</Label>
                  <Textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="outline" onClick={handleReset} className="gap-2">
                    <RotateCcw className="w-4 h-4" />
                    Reset to Default
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Button
          onClick={handleSave}
          disabled={saving || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 gap-2 h-14 text-lg"
        >
          <Save className="w-5 h-5" />
          {saved ? "Saved!" : saving ? "Saving..." : "Save All Settings"}
        </Button>

        {/* Danger Zone */}
        <Card className="mb-6 mt-6 border-red-200">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Delete Account
            </CardTitle>
            <CardDescription>
              Permanently delete your account and all associated data (contacts, exhibitions, places). This action cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={() => setShowDeleteDialog(true)}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete My Account
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Confirm Account Deletion
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              This will permanently delete all your contacts, exhibitions, and places. <strong>This cannot be undone.</strong>
            </p>
            <div>
              <Label>Type "DELETE" to confirm</Label>
              <Input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="DELETE"
                className="mt-1"
              />
            </div>
            {deleteError && (
              <p className="text-sm text-red-600">{deleteError}</p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteAccount}
              disabled={deleting || deleteConfirm !== "DELETE"}
              className="gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Deleting..." : "Delete Everything"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}