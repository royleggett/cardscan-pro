import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sendFeedback } from "@/functions/sendFeedback";
import { CheckCircle2 } from "lucide-react";

const CATEGORIES = ["General", "Scanning", "Exhibitions", "Discover & Places", "Email / Templates", "Billing", "Bug Report", "Feature Request"];

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [category, setCategory] = useState("General");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!message.trim()) { setError("Please write a message before sending."); return; }
    setSending(true);
    setError("");
    try {
      await sendFeedback({ rating, message, category });
      setSent(true);
    } catch (e) {
      setError("Something went wrong. Please try again.");
    }
    setSending(false);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <CheckCircle2 className="w-14 h-14 text-green-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Thank you!</h3>
        <p className="text-gray-500">Your feedback has been sent. We genuinely read every single one.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Star Rating */}
      <div>
        <Label className="text-sm text-gray-600 mb-2 block">How are we doing? (optional)</Label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(s => (
            <button
              key={s}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setRating(s)}
              className="text-3xl transition-transform hover:scale-110"
            >
              {s <= (hovered || rating) ? "⭐" : "☆"}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <div>
        <Label className="text-sm text-gray-600 mb-2 block">What's it about?</Label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-sm border-2 transition-all ${
                category === c ? "bg-blue-600 border-blue-600 text-white font-semibold" : "border-gray-200 text-gray-600 hover:border-blue-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Message */}
      <div>
        <Label className="text-sm text-gray-600 mb-2 block">Your message</Label>
        <Textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Tell us what you love, what's confusing, or what you'd love to see next..."
          className="min-h-28"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <Button
        onClick={handleSubmit}
        disabled={sending}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {sending ? "Sending..." : "Send Feedback"}
      </Button>

      <p className="text-xs text-center text-gray-400">
        Need a reply? Email us at{" "}
        <a href="mailto:support@cardscan-pro.com" className="text-blue-500 underline">
          support@cardscan-pro.com
        </a>
      </p>
    </div>
  );
}