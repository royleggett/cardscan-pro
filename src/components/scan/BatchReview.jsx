import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Check, Trash2, AlertTriangle } from "lucide-react";

function CardEditor({ card, index, onChange, onRemove }) {
  const [expanded, setExpanded] = useState(index === 0);
  const c = card.contact;

  const update = (field, value) => {
    onChange(index, { ...c, [field]: value });
  };

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
        <div className="p-4 bg-gray-50 border-t border-gray-200 grid grid-cols-2 gap-3">
          {card.contact.card_image_url && (
            <div className="col-span-2">
              <img src={card.contact.card_image_url} alt="Card" className="w-full max-h-32 object-contain rounded-lg border border-gray-200 bg-white" />
            </div>
          )}
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
      )}
    </div>
  );
}

export default function BatchReview({ cards: initialCards, onSaveAll, onCancel }) {
  const [cards, setCards] = useState(initialCards);

  const handleChange = (index, updatedContact) => {
    setCards(prev => prev.map((c, i) => i === index ? { ...c, contact: updatedContact } : c));
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
        onClick={() => onSaveAll(cards.map(c => c.contact))}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-base font-semibold"
      >
        <Check className="w-5 h-5 mr-2" />
        Save All {cards.length} Contact{cards.length !== 1 ? "s" : ""}
      </Button>
    </div>
  );
}