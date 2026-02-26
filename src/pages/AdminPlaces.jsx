import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, ArrowLeft, MapPin, User, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AdminPlaces() {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placeToDelete, setPlaceToDelete] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const me = await base44.auth.me();
    if (me?.role !== "admin") {
      window.location.href = createPageUrl("Home");
      return;
    }
    // Fetch all public places
    const allPlaces = await base44.entities.Place.list();
    const publicPlaces = allPlaces.filter(p => p.is_public);
    setPlaces(publicPlaces);
    setLoading(false);
  };

  const handleDelete = async () => {
    await base44.entities.Place.delete(placeToDelete.id);
    setPlaces(places.filter(p => p.id !== placeToDelete.id));
    setPlaceToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link to={createPageUrl("AdminUsers")}>
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Community Moderation</h1>
            <p className="text-gray-500 text-sm">{places.length} public place{places.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {places.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm text-center p-8">
            <p className="text-gray-500">No public places to moderate</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {places.map(place => (
              <Card key={place.id} className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">{place.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Badge variant="outline" className="text-xs">{place.category}</Badge>
                        {place.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{place.rating}/5</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
                      onClick={() => setPlaceToDelete(place)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {place.address && (
                    <div className="flex items-start gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <p className="truncate">{place.address}</p>
                    </div>
                  )}

                  {place.notes && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{place.notes}</p>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
                    <User className="w-3 h-3" />
                    <span>Added by: {place.created_by}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!placeToDelete} onOpenChange={() => setPlaceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Place?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{placeToDelete?.name}</strong> from the community. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete Place
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}