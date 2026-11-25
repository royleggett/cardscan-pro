import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ContactFilters({ exhibitions, countries, filters, onChange, onReset }) {
  const [open, setOpen] = useState(false);

  const activeCount = [
    filters.exhibition !== "all",
    filters.country !== "all",
    Boolean(filters.fromDate),
    Boolean(filters.toDate),
  ].filter(Boolean).length;

  return (
    <div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((o) => !o)}
          className="transition-all duration-150 active:scale-95"
        >
          <SlidersHorizontal className="w-4 h-4 mr-2" />
          Filters
          {activeCount > 0 && (
            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full px-1.5 py-0.5 leading-none">
              {activeCount}
            </span>
          )}
        </Button>
        {activeCount > 0 && (
          <Button variant="ghost" size="sm" onClick={onReset} className="transition-all active:scale-95">
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {open && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white border border-gray-200 rounded-xl p-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Exhibition</label>
            <Select
              value={filters.exhibition}
              onValueChange={(v) => onChange({ ...filters, exhibition: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All exhibitions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All exhibitions</SelectItem>
                {exhibitions.map(({ id, name }) => (
                  <SelectItem key={id} value={id}>
                    {name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Country</label>
            <Select
              value={filters.country}
              onValueChange={(v) => onChange({ ...filters, country: v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="All countries" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All countries</SelectItem>
                {countries.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Added from</label>
            <Input
              type="date"
              value={filters.fromDate}
              onChange={(e) => onChange({ ...filters, fromDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Added to</label>
            <Input
              type="date"
              value={filters.toDate}
              onChange={(e) => onChange({ ...filters, toDate: e.target.value })}
            />
          </div>
        </div>
      )}
    </div>
  );
}