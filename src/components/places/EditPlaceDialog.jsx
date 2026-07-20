import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2, Locate } from "lucide-react";
import { base44 } from "@/api/base44Client";
import CategoryAttributesSection from "./CategoryAttributesSection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DrawerSelect from "@/components/ui/drawer-select";

const PLACE_CATEGORIES = [
  { value: "Restaurant", label: "Restaurant" },
  { value: "Tourist Attraction", label: "Tourist Attraction" },
  { value: "Hotel", label: "Hotel" },
  { value: "Supermarket", label: "Supermarket" },
  { value: "Bar", label: "Bar" },
  { value: "Bakery", label: "Bakery" },
  { value: "Taxi Rank", label: "Taxi Rank" },
  { value: "Cafe", label: "Cafe" },
  { value: "Shopping", label: "Shopping" },
  { value: "Other", label: "Other" },
];

export default function EditPlaceDialog({ open, onOpenChange, place, onPlaceUpdated }) {
  const [placeData, setPlaceData] = useState(place || {
    name: "",
    category: "Restaurant",
    address: "",
    website: "",
    notes: "",
    rating: 0
  });
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    if (place) {
      setPlaceData(place);
    }
  }, [place]);

  const handleLocateMe = async () => {
    setLocating(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      
      if (data.display_name) {
        setPlaceData({ ...placeData, address: data.display_name, latitude, longitude });
      } else {
        setPlaceData({ ...placeData, address: `${latitude}, ${longitude}`, latitude, longitude });
      }
    } catch (err) {
      console.error("Location error:", err);
      alert("Could not get location. Please enable location access.");
    }
    setLocating(false);
  };

  const geocodeAddress = async (address, placeName) => {
    const queries = [
      address,
      `${address}, UK`,
      placeName ? `${placeName}, ${address}` : null,
    ].filter(Boolean);
    const postcodeMatch = address.match(/[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}/i);
    if (postcodeMatch) queries.push(postcodeMatch[0]);

    for (const q of queries) {
      try {
        const encoded = encodeURIComponent(q);
        const resp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encoded}&limit=1&countrycodes=gb`, {
          headers: { 'User-Agent': 'CardScanPro/1.0 (geocoding)' }
        });
        const data = await resp.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          if (!isNaN(lat) && !isNaN(lon)) return { latitude: lat, longitude: lon };
        }
      } catch (err) {
        console.error("Geocoding error:", err);
      }
    }
    return null;
  };

  const handleSave = async () => {
    // Auto-geocode from address if coordinates are missing
    let finalData = { ...placeData };
    if (!finalData.latitude && finalData.address && finalData.address.trim()) {
      const coords = await geocodeAddress(finalData.address, finalData.name);
      if (coords) finalData = { ...finalData, ...coords };
    }
    await base44.entities.Place.update(place.id, finalData);
    onPlaceUpdated();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Place</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label>Place Name *</Label>
            <Input
              value={placeData.name}
              onChange={(e) => setPlaceData({ ...placeData, name: e.target.value })}
              placeholder="Restaurant name or place"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Category *</Label>
            <DrawerSelect
              value={placeData.category}
              onValueChange={(value) => setPlaceData({ ...placeData, category: value })}
              options={PLACE_CATEGORIES}
              placeholder="Select category"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Address</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={placeData.address}
                onChange={(e) => setPlaceData({ ...placeData, address: e.target.value })}
                placeholder="Street address"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleLocateMe}
                disabled={locating}
              >
                {locating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Locate className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div>
            <Label>Website</Label>
            <div className="flex mt-1">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                https://
              </span>
              <Input
                value={(placeData.website || "").replace(/^https?:\/\//, "").replace(/^www\./, "")}
                onChange={(e) => {
                  const cleaned = e.target.value.replace(/^https?:\/\//, "").replace(/^www\./, "");
                  setPlaceData({ ...placeData, website: cleaned ? `https://${cleaned}` : "" });
                }}
                placeholder="example.com"
                className="rounded-l-none"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Just type the address — no need for www. or https://</p>
          </div>

          <div>
            <Label>Rating</Label>
            <div className="flex gap-2 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setPlaceData({ ...placeData, rating: star })}
                  className={`text-2xl ${star <= placeData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <CategoryAttributesSection
            category={placeData.category}
            selectedAttributes={placeData.attributes || []}
            onChange={(attrs) => setPlaceData({ ...placeData, attributes: attrs })}
          />

          <div>
            <Label>Notes</Label>
            <Textarea
              value={placeData.notes}
              onChange={(e) => setPlaceData({ ...placeData, notes: e.target.value })}
              placeholder="Great tapas! Ask for Paolo..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox
              id="is_public_edit"
              checked={placeData.is_public || false}
              onCheckedChange={(checked) => setPlaceData({ ...placeData, is_public: checked })}
            />
            <Label htmlFor="is_public_edit" className="text-sm font-normal cursor-pointer">
              Share this place with the community
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!placeData.name}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}