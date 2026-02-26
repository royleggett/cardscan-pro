import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Trash2, Star, Pencil, ExternalLink, Users, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import EditPlaceDialog from "./EditPlaceDialog";

export default function PlaceCard({ place, onUpdate }) {
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [isMyPlace, setIsMyPlace] = useState(false);

  useEffect(() => {
    const checkOwnership = async () => {
      const currentUser = await base44.auth.me();
      setIsMyPlace(place.created_by === currentUser.email);
    };
    checkOwnership();
  }, [place.created_by]);

  const handleDelete = async () => {
    await base44.entities.Place.delete(place.id);
    onUpdate();
  };

  const categoryColors = {
    "Restaurant": "bg-orange-100 text-orange-800",
    "Tourist Attraction": "bg-purple-100 text-purple-800",
    "Hotel": "bg-blue-100 text-blue-800",
    "Supermarket": "bg-green-100 text-green-800",
    "Bar": "bg-red-100 text-red-800",
    "Bakery": "bg-yellow-100 text-yellow-800",
    "Taxi Rank": "bg-gray-100 text-gray-800",
    "Cafe": "bg-amber-100 text-amber-800",
    "Shopping": "bg-pink-100 text-pink-800",
    "Other": "bg-slate-100 text-slate-800"
  };

  return (
    <>
      <Card className={`bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all ${isMyPlace && place.is_public ? 'border-l-4 border-l-green-400' : ''}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <CardTitle className="text-lg">{place.name}</CardTitle>
                {place.category && (
                  <Badge className={categoryColors[place.category] || "bg-gray-100 text-gray-800"}>
                    {place.category}
                  </Badge>
                )}
                {!isMyPlace && place.is_public && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    <Users className="w-3 h-3 mr-1" />
                    Community
                  </Badge>
                )}
              </div>
              {place.rating > 0 && (
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < place.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              )}
            </div>
            {isMyPlace && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowEdit(true)}
                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDelete(true)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          {place.address && (
            <div className="flex items-start gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{place.address}</span>
            </div>
          )}
          
          {place.website && (
            <a
              href={place.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <ExternalLink className="w-4 h-4" />
              Visit Website
            </a>
          )}
          
          {place.address && (
            <div className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(place.address)}
                className="flex items-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Copy Address
              </Button>
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50">
                  <Navigation className="w-4 h-4" />
                  Get Directions
                </Button>
              </a>
            </div>
          )}

          {place.notes && (
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg mt-2">
              {place.notes}
            </p>
          )}
        </CardContent>
      </Card>

      <EditPlaceDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        place={place}
        onPlaceUpdated={onUpdate}
      />

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Place</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{place.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}