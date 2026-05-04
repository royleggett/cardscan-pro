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
import { MapPin, Loader2, Locate, ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { createPlaceAsUser } from "@/functions/createPlaceAsUser";
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
  const [saving, setSaving] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState(null);

  useEffect(() => {
    if (open) {
      checkAdmin();
      // Reset form state when dialog opens
      setPlaceData({ name: "", category: "Restaurant", address: "", website: "", notes: "", rating: 0, is_public: false, attributes: [] });
    }
  }, [open]);

  const checkAdmin = async () => {
    const user = await base44.auth.me();
    const adminStatus = user?.role === "admin";
    setIsAdmin(adminStatus);
    
    if (adminStatus) {
      // Create fictional users for admin seeding
      const fictionalUsers = [
        { id: "fictional-0", email: user.email, user_number: "Me (real post)" },
        { id: "fictional-1", email: "sarah.mitchell@demo.app", user_number: "Sarah Mitchell (User #2847)" },
        { id: "fictional-2", email: "james.chen@demo.app", user_number: "James Chen (User #3921)" },
        { id: "fictional-3", email: "maria.rodriguez@demo.app", user_number: "Maria Rodriguez (User #1563)" },
        { id: "fictional-4", email: "david.thompson@demo.app", user_number: "David Thompson (User #4205)" },
        { id: "fictional-5", email: "emily.watson@demo.app", user_number: "Emily Watson (User #2674)" }
      ];
      setAllUsers(fictionalUsers);
    }
    setSelectedUserEmail(user.email);
  };



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
    setSaving(true);
    try {
      const createData = {
        exhibition_id: exhibitionId || "none",
        ...placeData
      };
      
      const currentUser = await base44.auth.me();
      const isPostingAsOther = isAdmin && selectedUserEmail && selectedUserEmail !== currentUser.email;
      
      if (isPostingAsOther) {
        // Admin creating as another user - use backend function
        await createPlaceAsUser({
          placeData: createData,
          asUserEmail: selectedUserEmail
        });
      } else {
        // Normal user creation
        await base44.entities.Place.create(createData);
      }
      
      setPlaceData({ name: "", category: "Restaurant", address: "", website: "", notes: "", rating: 0, is_public: false, attributes: [] });
      setSelectedUserEmail(currentUser.email);
      onPlaceAdded();
      onOpenChange(false);
    } catch (error) {
      console.error("Save error:", error);
      alert(`Failed to save: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <DialogTitle>Add Place or Restaurant</DialogTitle>
          </div>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          {isAdmin && allUsers.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <Label className="text-sm font-semibold text-yellow-900">👑 Admin: Post as User</Label>
              <Select
                value={selectedUserEmail}
                onValueChange={setSelectedUserEmail}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Select user" />
                </SelectTrigger>
                <SelectContent>
                  {allUsers.map(user => (
                    <SelectItem key={user.id} value={user.email}>
                      {user.user_number || user.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-yellow-700 mt-1">This place will appear as posted by the selected user</p>
            </div>
          )}

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

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!placeData.name || saving}
            className="active:scale-95 transition-transform"
          >
            {saving ? "Saving..." : "Save Place"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}