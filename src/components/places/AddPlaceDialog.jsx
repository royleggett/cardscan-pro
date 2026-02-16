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
import { MapPin, Loader2, Locate } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AddPlaceDialog({ open, onOpenChange, exhibitionId, onPlaceAdded }) {
  const [placeData, setPlaceData] = useState({
    name: "",
    category: "Restaurant",
    address: "",
    notes: "",
    rating: 0
  });
  const [locating, setLocating] = useState(false);



  const handleLocateMe = async () => {
    setLocating(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Look up the street address for GPS coordinates ${latitude}, ${longitude}. Return ONLY the street address in plain text format (no markdown, no links, no coordinates). Example format: "123 Main Street, City, PostCode, Country"`,
        add_context_from_internet: true
      });
      
      setPlaceData({ ...placeData, address: result.trim() });
    } catch (err) {
      console.error("Location error:", err);
      alert("Could not get location. Please enable location access.");
    }
    setLocating(false);
  };

  const handleSave = async () => {
    await base44.entities.Place.create({
      exhibition_id: exhibitionId,
      ...placeData
    });
    
    setPlaceData({ name: "", category: "Restaurant", address: "", notes: "", rating: 0 });
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
            <Input
              value={placeData.name}
              onChange={(e) => setPlaceData({ ...placeData, name: e.target.value })}
              placeholder="Restaurant name or place"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Category *</Label>
            <Select
              value={placeData.category}
              onValueChange={(value) => setPlaceData({ ...placeData, category: value })}
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Restaurant">Restaurant</SelectItem>
                <SelectItem value="Tourist Attraction">Tourist Attraction</SelectItem>
                <SelectItem value="Hotel">Hotel</SelectItem>
                <SelectItem value="Supermarket">Supermarket</SelectItem>
                <SelectItem value="Bar">Bar</SelectItem>
                <SelectItem value="Bakery">Bakery</SelectItem>
                <SelectItem value="Taxi Rank">Taxi Rank</SelectItem>
                <SelectItem value="Cafe">Cafe</SelectItem>
                <SelectItem value="Shopping">Shopping</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
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