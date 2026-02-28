import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";

export default function JoinExhibitionDialog({ open, onOpenChange, onJoined, initialCode = "" }) {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async () => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    setLoading(true);
    setError("");

    const matches = await base44.entities.Exhibition.filter({ team_code: trimmed });
    if (matches.length === 0) {
      setError("Code not found. Please check and try again.");
      setLoading(false);
      return;
    }

    const exhibition = matches[0];
    const user = await base44.auth.me();

    if (exhibition.created_by === user.email) {
      setError("You created this exhibition — you're already the owner!");
      setLoading(false);
      return;
    }

    const currentMembers = exhibition.team_members || [];
    if (currentMembers.includes(user.email)) {
      setError("You've already joined this exhibition.");
      setLoading(false);
      return;
    }

    await base44.entities.Exhibition.update(exhibition.id, {
      team_members: [...currentMembers, user.email]
    });

    setCode("");
    setLoading(false);
    onOpenChange(false);
    if (onJoined) onJoined();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Join a Team Exhibition
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-gray-500">
            Enter the team code shared by your exhibition manager to join their booth.
          </p>
          <div>
            <Label>Team Code</Label>
            <Input
              value={code}
              onChange={e => { setCode(e.target.value.toUpperCase()); setError(""); }}
              placeholder="e.g. EXPO-4729"
              className="mt-1 font-mono text-lg tracking-widest uppercase"
              onKeyDown={e => e.key === "Enter" && handleJoin()}
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={handleJoin} disabled={loading || !code.trim()} className="bg-blue-600 hover:bg-blue-700">
            {loading ? "Joining..." : "Join Exhibition"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}