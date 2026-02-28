import React, { useState } from "react";
import { Copy, Check, Users, Link } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeamCodeDisplay({ code, memberCount = 0 }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const appUrl = window.location.origin;
  const joinLink = `${appUrl}?join=${code}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(joinLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Users className="w-4 h-4 text-blue-600" />
        <span className="text-sm font-semibold text-blue-800">Team Access</span>
        {memberCount > 0 && (
          <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
            {memberCount} member{memberCount !== 1 ? "s" : ""} joined
          </span>
        )}
      </div>

      {/* Join Link */}
      <div>
        <p className="text-xs text-blue-600 font-medium mb-1">Share Link</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 bg-white border border-blue-200 rounded-lg px-3 py-2 text-xs text-blue-700 font-mono truncate">
            {joinLink}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="border-blue-300 text-blue-700 hover:bg-blue-100 flex-shrink-0"
          >
            {copiedLink ? <Check className="w-4 h-4" /> : <Link className="w-4 h-4" />}
            {copiedLink ? "Copied!" : "Copy Link"}
          </Button>
        </div>
        <p className="text-xs text-blue-500 mt-1">Tap the link to open the app directly (or install it first)</p>
      </div>

      {/* Team Code */}
      <div>
        <p className="text-xs text-blue-600 font-medium mb-1">Or share the code manually</p>
        <div className="flex items-center gap-3">
          <span className="font-mono text-2xl font-bold text-blue-700 tracking-widest">{code}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCode}
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            {copiedCode ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copiedCode ? "Copied!" : "Copy Code"}
          </Button>
        </div>
      </div>
    </div>
  );
}