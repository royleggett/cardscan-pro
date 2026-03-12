import React, { useState } from "react";
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
import { MapPin, Loader2, Locate, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import CategoryAttributesSection from "./CategoryAttributesSection";
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
    website: "",
    notes: "",
    rating: 0,
    is_public: false,
    attributes: []
  });
  const [locating, setLocating] = useState(false);



  const handleLocateMe = async () => {
    setLocating(true);
    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      
      const { latitude, longitude } = position.coords;
      
      // Use reverse geocoding API
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
      const data = await response.json();
      
      if (data.display_name) {
        setPlaceData({ ...placeData, address: data.display_name });
      } else {
        setPlaceData({ ...placeData, address: `${latitude}, ${longitude}` });
      }
    } catch (err) {
      console.error("Location error:", err);
      alert("Could not get location. Please enable location access.");
    }
    setLocating(false);
  };

  const handleSave = async () => {
    await base44.entities.Place.create({
      exhibition_id: exhibitionId || "none",
      ...placeData
    });
    
    setPlaceData({ name: "", category: "Restaurant", address: "", website: "", notes: "", rating: 0, is_public: false, attributes: [] });
    onPlaceAdded();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8 flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <DialogTitle>Add Place or Restaurant</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-4 overflow-y-auto flex-1">
          <div>
            <Label>Category *</Label>
            <Select
              value={placeData.category}
              onValueChange={(value) => setPlaceData({ ...placeData, category: value, attributes: [] })}
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
            <Label>Place Name *</Label>
            <Input
              value={placeData.name}
              onChange={(e) => setPlaceData({ ...placeData, name: e.target.value })}
              placeholder="Restaurant name or place"
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
              id="is_public"
              checked={placeData.is_public}
              onCheckedChange={(checked) => setPlaceData({ ...placeData, is_public: checked })}
            />
            <Label htmlFor="is_public" className="text-sm font-normal cursor-pointer">
              Share this place with the community
            </Label>
          </div>
        </div>

        <DialogFooter className="flex-shrink-0">
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