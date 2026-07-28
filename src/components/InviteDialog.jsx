import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Mail, Send, Check } from "lucide-react";

export default function InviteDialog({ open, onOpenChange }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleInvite = async () => {
    const trimmed = email.trim();
    if (!trimmed) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      await base44.users.inviteUser(trimmed, "user");
      setStatus("sent");
      setEmail("");
      setTimeout(() => {
        setStatus("idle");
        onOpenChange(false);
      }, 2000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err?.message || "Something went wrong. Please try again.");
    }
  };

  const handleClose = (v) => {
    if (!v) {
      setStatus("idle");
      setEmail("");
      setErrorMsg("");
    }
    onOpenChange(v);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Invite a Friend
          </DialogTitle>
          <DialogDescription>
            Enter their email and we'll send them an invitation to join CardScan Pro.
          </DialogDescription>
        </DialogHeader>

        {status === "sent" ? (
          <div className="flex flex-col items-center py-6 gap-2">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-center font-medium text-gray-900">Invitation sent!</p>
          </div>
        ) : (
          <div className="space-y-3 py-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="friend@example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter" && email.trim() && status !== "sending") {
                  handleInvite();
                }
              }}
            />
            {status === "error" && (
              <p className="text-sm text-red-600">{errorMsg}</p>
            )}
          </div>
        )}

        {status !== "sent" && (
          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleInvite}
              disabled={!email.trim() || status === "sending"}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {status === "sending" ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-1" />
                  Send Invite
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}