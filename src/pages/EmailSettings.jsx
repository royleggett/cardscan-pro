import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const DEFAULT_SUBJECT = `Thank you for visiting us at {exhibition_name}`;
const DEFAULT_BODY = `Dear {contact_name},

Thank you for visiting us at {exhibition_name}. It was a pleasure meeting you!

We hope you enjoyed the event and found our time together valuable. We will be in touch soon.

Warm regards,
{sender_name}`;

export default function EmailSettings() {
  const [subject, setSubject] = useState(DEFAULT_SUBJECT);
  const [body, setBody] = useState(DEFAULT_BODY);
  const [resendApiKey, setResendApiKey] = useState("");
  const [fromEmail, setFromEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTemplate();
  }, []);

  const loadTemplate = async () => {
    const user = await base44.auth.me();
    const templates = await base44.entities.EmailTemplate.filter({ template_key: "thank_you" });
    if (templates.length > 0) {
      setSubject(templates[0].subject);
      setBody(templates[0].body);
    }
    setResendApiKey(user?.resend_api_key || "");
    setFromEmail(user?.resend_from_email || "");
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
      resend_from_email: fromEmail
    });
    
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleReset = () => {
    setSubject(DEFAULT_SUBJECT);
    setBody(DEFAULT_BODY);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <Link to={createPageUrl("Home")}>
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Email Setup</CardTitle>
            <CardDescription>
              Configure your Resend account to send thank you emails to contacts. Get your free API key at <a href="https://resend.com" target="_blank" className="text-blue-600 hover:underline">resend.com</a>
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
                    placeholder="e.g. hello@cardscan-pro.com"
                    value={fromEmail} 
                    onChange={e => setFromEmail(e.target.value)} 
                  />
                  <p className="text-xs text-gray-500 mt-1">Use an address from your verified domain (e.g. hello@cardscan-pro.com)</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Email Template</CardTitle>
            <CardDescription>
              Customise the email sent to contacts after scanning their card.
              Use these placeholders and they'll be replaced automatically:
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
                  <Button onClick={handleSave} disabled={saving} className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2">
                    <Save className="w-4 h-4" />
                    {saved ? "Saved!" : saving ? "Saving..." : "Save Settings"}
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}