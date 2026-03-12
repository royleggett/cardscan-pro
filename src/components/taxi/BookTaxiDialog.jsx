import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin, Loader2, Navigation } from "lucide-react";

export default function BookTaxiDialog({ open, onOpenChange, defaultDestination = "" }) {
  const [destination, setDestination] = useState(defaultDestination);
  const [locating, setLocating] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  const getLocation = () => {
    setLocating(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocationError("Could not get your location. Please allow location access and try again.");
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const openUber = () => {
    const dest = encodeURIComponent(destination);
    if (userLocation) {
      window.open(
        `https://m.uber.com/ul/?action=setPickup&pickup[latitude]=${userLocation.lat}&pickup[longitude]=${userLocation.lng}&dropoff[nickname]=${dest}&dropoff[formatted_address]=${dest}`,
        "_blank"
      );
    } else {
      window.open(`https://m.uber.com/ul/?action=setPickup&dropoff[nickname]=${dest}&dropoff[formatted_address]=${dest}`, "_blank");
    }
  };

  const openBolt = () => {
    const dest = encodeURIComponent(destination);
    if (userLocation) {
      window.open(
        `https://bolt.eu/en/ride/?destination=${dest}&pickup_lat=${userLocation.lat}&pickup_lng=${userLocation.lng}`,
        "_blank"
      );
    } else {
      window.open(`https://bolt.eu/en/ride/?destination=${dest}`, "_blank");
    }
  };

  const handleOpen = (isOpen) => {
    if (isOpen) {
      setUserLocation(null);
      setLocationError("");
      getLocation();
    }
    onOpenChange(isOpen);
  };

  React.useEffect(() => {
    if (defaultDestination) {
      setDestination(defaultDestination);
    }
  }, [defaultDestination]);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🚕 Book a Taxi
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Location status */}
          <div className={`flex items-center gap-2 text-sm rounded-lg px-3 py-2 ${
            locating ? "bg-blue-50 text-blue-700" :
            userLocation ? "bg-green-50 text-green-700" :
            locationError ? "bg-red-50 text-red-700" :
            "bg-gray-50 text-gray-600"
          }`}>
            {locating ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Getting your location...</>
            ) : userLocation ? (
              <><Navigation className="w-4 h-4" /> Location found</>
            ) : (
              <><MapPin className="w-4 h-4" /> {locationError || "Location not detected"}</>
            )}
            {!locating && !userLocation && (
              <button onClick={getLocation} className="ml-auto underline text-xs">Retry</button>
            )}
          </div>

          {/* Destination */}
          <div>
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Enter destination address..."
              className="mt-1"
            />
            <p className="text-xs text-gray-400 mt-1">You can change this to anywhere you like</p>
          </div>

          {/* Booking buttons */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={openUber}
              disabled={!destination.trim()}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="text-2xl">🖤</span>
              <span className="font-semibold text-sm">Uber</span>
            </button>
            <button
              onClick={openBolt}
              disabled={!destination.trim()}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 border-gray-200 hover:border-green-500 hover:bg-green-500 hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="text-2xl">⚡</span>
              <span className="font-semibold text-sm">Bolt</span>
            </button>
          </div>

          <p className="text-xs text-center text-gray-400">
            Opens Uber or Bolt app/website with your location pre-filled
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}