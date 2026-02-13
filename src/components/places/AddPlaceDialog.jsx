import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { MapPin, Search, Camera, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function AddPlaceDialog({ open, onOpenChange, exhibitionId, onPlaceAdded }) {
  const [searching, setSearching] = useState(false);
  const [placeData, setPlaceData] = useState({
    name: "",
    address: "",
    google_maps_link: "",
    notes: "",
    rating: 0
  });

  const handleSearch = async () => {
    if (!placeData.name) return;
    
    setSearching(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Find the location details for: "${placeData.name}". Return location information.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            full_name: { type: "string" },
            address: { type: "string" }
          }
        }
      });

      const fullName = result.full_name || placeData.name;
      const address = result.address || "";
      
      // Construct Google Maps search URL
      const searchQuery = encodeURIComponent(`${fullName} ${address}`.trim());
      const mapsLink = `https://maps.google.com/?q=${searchQuery}`;

      setPlaceData({
        ...placeData,
        name: fullName,
        address: address,
        google_maps_link: mapsLink
      });
    } catch (err) {
      console.error("Search failed:", err);
    }
    setSearching(false);
  };

  const handleSave = async () => {
    // If no Google Maps link yet, create one from name and address
    let finalData = { ...placeData };
    if (!finalData.google_maps_link && finalData.name) {
      const searchQuery = encodeURIComponent(`${finalData.name} ${finalData.address || ""}`.trim());
      finalData.google_maps_link = `https://maps.google.com/?q=${searchQuery}`;
    }
    
    await base44.entities.Place.create({
      exhibition_id: exhibitionId,
      ...finalData
    });
    
    setPlaceData({ name: "", address: "", google_maps_link: "", notes: "", rating: 0 });
    onPlaceAdded();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Place or Restaurant</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <Label>Place Name *</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={placeData.name}
                onChange={(e) => setPlaceData({ ...placeData, name: e.target.value })}
                placeholder="Restaurant name or place"
              />
              <Button 
                onClick={handleSearch} 
                disabled={searching || !placeData.name}
                size="icon"
                variant="outline"
              >
                {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Type name and click search to auto-fill</p>
          </div>

          <div>
            <Label>Address</Label>
            <Input
              value={placeData.address}
              onChange={(e) => setPlaceData({ ...placeData, address: e.target.value })}
              placeholder="Street address"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Google Maps Link</Label>
            <Input
              value={placeData.google_maps_link}
              onChange={(e) => setPlaceData({ ...placeData, google_maps_link: e.target.value })}
              placeholder="https://maps.google.com/..."
              className="mt-1"
            />
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!placeData.name}>
            Save Place
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}