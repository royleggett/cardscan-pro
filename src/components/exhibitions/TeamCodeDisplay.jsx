import React, { useState } from "react";
import { Copy, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TeamCodeDisplay({ code, memberCount = 0 }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-800">Team Code</span>
          {memberCount > 0 && (
            <span className="text-xs bg-blue-200 text-blue-700 px-2 py-0.5 rounded-full">
              {memberCount} member{memberCount !== 1 ? "s" : ""} joined
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="font-mono text-2xl font-bold text-blue-700 tracking-widest">{code}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>
      <p className="text-xs text-blue-600 mt-2">Share this code with your booth team so they can join.</p>
    </div>
  );
}