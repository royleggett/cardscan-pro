import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Flame, Thermometer, Snowflake, X, Mail, Loader2 } from "lucide-react";

const LEAD_OPTIONS = [
  {
    type: "hot",
    label: "Hot Lead",
    sublabel: "Follow up within 24 hours",
    icon: Flame,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-300",
    daysFromNow: 1
  },
  {
    type: "warm",
    label: "Warm Lead",
    sublabel: "Follow up next week",
    icon: Thermometer,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-300",
    daysFromNow: 7
  },
  {
    type: "cool",
    label: "Cool Lead",
    sublabel: "Follow up next month",
    icon: Snowflake,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-300",
    daysFromNow: 30
  },
  {
    type: "none",
    label: "No Follow-up",
    sublabel: "Skip reminder",
    icon: X,
    color: "text-gray-500",
    bg: "bg-gray-50",
    border: "border-gray-200",
    daysFromNow: null
  }
];

export default function FollowUpDialog({ open, contactName, contactEmail, exhibitionName, onComplete }) {
  const [sendingEmail, setSendingEmail] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [step, setStep] = useState("lead"); // "lead" or "email"

  const handleLeadSelect = (option) => {
    setSelectedLead(option);
    setStep("email");
  };

  const getFollowUpDate = (daysFromNow) => {
    if (!daysFromNow) return null;
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split("T")[0];
  };

  const handleEmailChoice = async (sendEmail) => {
    setSendingEmail(true);
    const followUpDate = getFollowUpDate(selectedLead.daysFromNow);
    onComplete({
      follow_up_type: selectedLead.type,
      follow_up_date: followUpDate,
      sendThankYou: sendEmail
    });
  };

  const handleSkipAll = () => {
    onComplete({ follow_up_type: "none", follow_up_date: null, sendThankYou: false });
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-sm mx-auto" onInteractOutside={(e) => e.preventDefault()}>
        {step === "lead" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                How was this lead?
              </DialogTitle>
              <p className="text-center text-gray-500 text-sm mt-1">
                {contactName}
              </p>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              {LEAD_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.type}
                    onClick={() => handleLeadSelect(option)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 ${option.bg} ${option.border} hover:scale-[1.02] active:scale-[0.98] transition-all`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm`}>
                      <Icon className={`w-5 h-5 ${option.color}`} />
                    </div>
                    <div className="text-left">
                      <p className={`font-semibold ${option.color}`}>{option.label}</p>
                      <p className="text-xs text-gray-500">{option.sublabel}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">
                Send a thank you?
              </DialogTitle>
              <p className="text-center text-gray-500 text-sm mt-1">
                {contactEmail
                  ? `Send to ${contactEmail}`
                  : "No email address on file"}
              </p>
            </DialogHeader>
            <div className="space-y-3 mt-2">
              {contactEmail ? (
                <>
                  <button
                    onClick={() => handleEmailChoice(true)}
                    disabled={sendingEmail}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 bg-blue-50 border-blue-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm">
                      {sendingEmail ? (
                        <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                      ) : (
                        <Mail className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-blue-600">Yes, send it!</p>
                      <p className="text-xs text-gray-500">
                        {exhibitionName
                          ? `"Thank you for visiting us at ${exhibitionName}"`
                          : "Send a thank you email"}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={() => handleEmailChoice(false)}
                    disabled={sendingEmail}
                    className="w-full flex items-center gap-4 p-4 rounded-xl border-2 bg-gray-50 border-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm">
                      <X className="w-5 h-5 text-gray-500" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-600">Skip for now</p>
                      <p className="text-xs text-gray-500">No email will be sent</p>
                    </div>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleEmailChoice(false)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl border-2 bg-gray-50 border-gray-200 hover:scale-[1.02] transition-all"
                >
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-sm">
                    <X className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-600">Continue</p>
                    <p className="text-xs text-gray-500">No email address to send to</p>
                  </div>
                </button>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}