import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CATEGORY_ATTRIBUTES } from "./categoryAttributes";

export default function CategoryAttributesSection({ category, selectedAttributes = [], onChange }) {
  const attrs = CATEGORY_ATTRIBUTES[category] || [];
  if (attrs.length === 0) return null;

  const toggle = (attr) => {
    const updated = selectedAttributes.includes(attr)
      ? selectedAttributes.filter((a) => a !== attr)
      : [...selectedAttributes, attr];
    onChange(updated);
  };

  return (
    <div>
      <Label className="text-sm font-medium text-gray-700 mb-2 block">Features</Label>
      <div className="grid grid-cols-2 gap-2">
        {attrs.map((attr) => (
          <div key={attr} className="flex items-center gap-2">
            <Checkbox
              id={`attr-${attr}`}
              checked={selectedAttributes.includes(attr)}
              onCheckedChange={() => toggle(attr)}
            />
            <Label htmlFor={`attr-${attr}`} className="text-sm font-normal cursor-pointer leading-tight">
              {attr}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}