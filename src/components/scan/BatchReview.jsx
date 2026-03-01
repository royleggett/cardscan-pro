import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Check, Trash2, AlertTriangle, Flame, Thermometer, Snowflake, Mail, MinusCircle } from "lucide-react";

const LEAD_OPTIONS = [
  { value: "hot", label: "Hot", icon: Flame, color: "text-red-500", bg: "bg-red-50 border-red-400", inactive: "bg-white border-gray-200 text-gray-500" },
  { value: "warm", label: "Warm", icon: Thermometer, color: "text-amber-500", bg: "bg-amber-50 border-amber-400", inactive: "bg-white border-gray-200 text-gray-500" },
  { value: "cool", label: "Cool", icon: Snowflake, color: "text-blue-400", bg: "bg-blue-50 border-blue-400", inactive: "bg-white border-gray-200 text-gray-500" },
  { value: "none", label: "None", icon: MinusCircle, color: "text-gray-400", bg: "bg-gray-100 border-gray-400", inactive: "bg-white border-gray-200 text-gray-500" },
];

function CardEditor({ card, index, onChange, onRemove }) {
  const [expanded, setExpanded] = useState(index === 0);
  const c = card.contact;
  const followUpType = card.follow_up_type || "none";
  const sendThankYou = card.sendThankYou || false;

  const update = (field, value) => {
    onChange(index, { ...c, [field]: value });
  };

  const updateMeta = (field, value) => {
    onChange(index, c, { [field]: value });
  };

  const hasEmail = !!(c.email || "").trim();

  return (
    <div className={`border-2 rounded-xl overflow-hidden ${card.isDuplicate ? "border-amber-300" : "border-gray-200"}`}>
      <button
        className="w-full flex items-center justify-between p-4 bg-white hover:bg-gray-50"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex items-center gap-3 text-left">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${card.isDuplicate ? "bg-amber-500" : "bg-blue-600"}`}>
            {index + 1}
          </div>
          <div>
            <p className="font-semibold text-gray-800">{c.full_name || "Unnamed"}</p>
            {c.company && <p className="text-sm text-gray-500">{c.company}</p>}
            {card.isDuplicate && (
              <p className="text-xs text-amber-600 flex items-center gap-1 mt-0.5">
                <AlertTriangle className="w-3 h-3" /> Possible duplicate
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Lead temperature mini-badge */}
          {followUpType !== "none" && (() => {
            const opt = LEAD_OPTIONS.find(o => o.value === followUpType);
            const Icon = opt?.icon;
            return Icon ? <Icon className={`w-4 h-4 ${opt.color}`} /> : null;
          })()}
          {sendThankYou && hasEmail && <Mail className="w-4 h-4 text-green-500" />}
          <button
            onClick={e => { e.stopPropagation(); onRemove(index); }}
            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="p-4 bg-gray-50 border-t border-gray-200 space-y-4">
          {/* Card image */}
          {card.contact.card_image_url && (
            <img src={card.contact.card_image_url} alt="Card" className="w-full max-h-32 object-contain rounded-lg border border-gray-200 bg-white" />
          )}

          {/* Contact fields */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { field: "full_name", label: "Full Name", span: 2 },
              { field: "company", label: "Company" },
              { field: "position", label: "Position" },
              { field: "email", label: "Email" },
              { field: "phone_mobile", label: "Mobile" },
              { field: "phone_landline", label: "Landline" },
              { field: "website", label: "Website" },
              { field: "country", label: "Country" },
            ].map(({ field, label, span }) => (
              <div key={field} className={span === 2 ? "col-span-2" : ""}>
                <Label className="text-xs text-gray-500 mb-1">{label}</Label>
                <Input
                  value={c[field] || ""}
                  onChange={e => update(field, e.target.value)}
                  className="bg-white text-sm h-8"
                />
              </div>
            ))}
          </div>

          {/* Lead Temperature */}
          <div>
            <Label className="text-xs text-gray-500 mb-2 block">Lead Temperature</Label>
            <div className="flex gap-2">
              {LEAD_OPTIONS.map(opt => {
                const Icon = opt.icon;
                const active = followUpType === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => updateMeta("follow_up_type", opt.value)}
                    className={`flex-1 flex flex-col items-center gap-1 py-2 rounded-lg border-2 transition-all text-xs font-semibold ${active ? opt.bg + " " + opt.color : opt.inactive}`}
                  >
                    <Icon className={`w-4 h-4 ${active ? opt.color : "text-gray-400"}`} />
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thank You Email */}
          {hasEmail && (
            <div>
              <Label className="text-xs text-gray-500 mb-2 block">Thank You Email</Label>
              <button
                onClick={() => updateMeta("sendThankYou", !sendThankYou)}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${sendThankYou ? "bg-green-50 border-green-400 text-green-700" : "bg-white border-gray-200 text-gray-500"}`}
              >
                <Mail className={`w-4 h-4 ${sendThankYou ? "text-green-600" : "text-gray-400"}`} />
                <span className="text-sm font-medium">
                  {sendThankYou ? `Send thank you to ${c.email}` : "Send thank you email"}
                </span>
                <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${sendThankYou ? "bg-green-500 border-green-500" : "border-gray-300"}`}>
                  {sendThankYou && <Check className="w-3 h-3 text-white" />}
                </div>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function BatchReview({ cards: initialCards, onSaveAll, onCancel }) {
  const [cards, setCards] = useState(
    initialCards.map(c => ({ ...c, follow_up_type: "none", sendThankYou: false }))
  );

  const handleChange = (index, updatedContact, metaUpdates = {}) => {
    setCards(prev => prev.map((c, i) =>
      i === index ? { ...c, contact: updatedContact, ...metaUpdates } : c
    ));
  };

  const handleRemove = (index) => {
    setCards(prev => prev.filter((_, i) => i !== index));
  };

  if (cards.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <p className="text-gray-500 mb-4">All cards removed.</p>
        <Button onClick={onCancel}>Back</Button>
      </div>
    );
  }

  const handleSave = () => {
    const payload = cards.map(c => ({
      contact: { ...c.contact, follow_up_type: c.follow_up_type || "none" },
      sendThankYou: c.sendThankYou || false,
    }));
    onSaveAll(payload);
  };

  return (
    <div className="min-h-screen px-4 py-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Review Cards</h2>
          <p className="text-sm text-gray-500">{cards.length} card{cards.length !== 1 ? "s" : ""} ready to save</p>
        </div>
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
      </div>

      <div className="space-y-3 mb-6">
        {cards.map((card, i) => (
          <CardEditor
            key={i}
            card={card}
            index={i}
            onChange={handleChange}
            onRemove={handleRemove}
          />
        ))}
      </div>

      <Button
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold"
      >
        <Check className="w-5 h-5 mr-2" />
        Save All {cards.length} Contact{cards.length !== 1 ? "s" : ""}
      </Button>
    </div>
  );
}