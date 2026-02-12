import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Copy, Check, SkipForward } from "lucide-react";

export default function EmailPreview({ contact, exhibitionName, onCopy, onSkip }) {
  const [copied, setCopied] = useState(false);
  
  const defaultSubject = `Thank You for Visiting Us at ${exhibitionName}`;
  
  const defaultBody = `Hi ${contact.full_name || 'there'},

Thank you for stopping by our booth at ${exhibitionName}. It was a pleasure meeting you.

${contact.notes ? `I've noted your request — ${contact.notes} — and will attend to this once I've returned from the show.\n\n` : ''}In the meantime, if you think of any additional questions or have a project you'd like us to look at, please feel free to fire away. We're always here to assist and would be happy to help.

Best regards`;

  const [subject, setSubject] = useState(defaultSubject);
  const [body, setBody] = useState(defaultBody);

  const handleCopy = async () => {
    const emailText = `To: ${contact.email}\nSubject: ${subject}\n\n${body}`;
    await navigator.clipboard.writeText(emailText);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onCopy();
    }, 1500);
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Thank You Email Template
          </CardTitle>
          <p className="text-sm text-gray-500">
            Copy this email template to send manually to {contact.email}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">To:</p>
                <p className="text-sm text-blue-700">{contact.full_name} ({contact.email})</p>
                {contact.company && (
                  <p className="text-sm text-blue-600 mt-1">{contact.company}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Message</Label>
            <Textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onSkip}
              className="flex-1"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Skip
            </Button>
            <Button
              onClick={handleCopy}
              disabled={!subject || !body}
              className="flex-1 bg-blue-600 hover:bg-blue-700"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  Copy Email
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}