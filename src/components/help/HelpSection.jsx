import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function HelpSection({ icon, title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        {open ? <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" /> : <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className="px-5 pb-5 pt-1 bg-gray-50 border-t border-gray-100 text-gray-700 text-sm leading-relaxed space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}