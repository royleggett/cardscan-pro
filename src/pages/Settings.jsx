import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save, RotateCcw, Flame, Thermometer, Snowflake, Plus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Switch } from "@/components/ui/switch";

const DEFAULT_SUBJECT = `Thank you for visiting us at {exhibition_name}`;
const DEFAULT_BODY = `Dear {contact_name},

Thank you for visiting us at {exhibition_name}. It was a pleasure meeting you!

We hope you enjoyed the event and found our time together valuable. We will be in touch soon.

Warm regards,
{sender_name}`;

export default function Settings() {
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [resendApiKey, setResendApiKey] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

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
    setResendApiKey(user?.resend_api_key || "");
    setFromEmail(user?.resend_from_email || "");
    setRemindHot(user?.followup_remind_hot ?? true);
    setRemindWarm(user?.followup_remind_warm ?? true);
    setRemindCool(user?.followup_remind_cool ?? false);
    setDaysHot(user?.followup_days_hot ?? 1);
    setDaysWarm(user?.followup_days_warm ?? 3);
    setDaysCool(user?.followup_days_cool ?? 7);
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const templates = await base44.entities.EmailTemplate.filter({ template_key: "thank_you" });
    if (templates.length > 0) {
      await base44.entities.EmailTemplate.update(templates[0].id, { subject, body });
    } else {
      await base44.entities.EmailTemplate.create({ template_key: "thank_you", subject, body });
    }

    await base44.auth.updateMe({
      resend_api_key: resendApiKey,
      resend_from_email: fromEmail,
      followup_remind_hot: remindHot,
      followup_remind_warm: remindWarm,
      followup_remind_cool: remindCool,
      followup_days_hot: Number(daysHot),
      followup_days_warm: Number(daysWarm),
      followup_days_cool: Number(daysCool),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setSubject(DEFAULT_SUBJECT);
    setBody(DEFAULT_BODY);
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
        <Link to={createPageUrl("Home")}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

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
                <LeadRow
                  icon={Snowflake} iconColor="text-blue-400" label="Cool"
                  enabled={remindCool} onToggle={setRemindCool}
                  days={daysCool} onDaysChange={setDaysCool}
                />
                <p className="text-xs text-gray-400 pt-1">
                  Reminders are sent to your registered email address each morning.
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Email Setup */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Email Setup</CardTitle>
            <CardDescription>
              Configure your Resend account to send thank you emails and reminders. Get your free API key at{" "}
              <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">resend.com</a>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-400">Loading...</div>
            ) : (
              <>
                <div>
                  <Label className="mb-1 block">Resend API Key</Label>
                  <Input
                    type="password"
                    placeholder="re_..."
                    value={resendApiKey}
                    onChange={e => setResendApiKey(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Get from resend.com/api-keys</p>
                </div>
                <div>
                  <Label className="mb-1 block">From Email Address</Label>
                  <Input
                    type="email"
                    placeholder="hello@yourdomain.com"
                    value={fromEmail}
                    onChange={e => setFromEmail(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-1">Must be a verified domain in Resend. Used for both thank you emails and reminders.</p>
                </div>
              </>
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
      </div>
    </div>
  );
}