import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MapPin, Star, ExternalLink, Search, Filter, Navigation, ThumbsUp, ThumbsDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import BookTaxiDialog from "@/components/taxi/BookTaxiDialog";

const CATEGORIES = ["All", "Restaurant", "Bar", "Cafe", "Hotel", "Tourist Attraction", "Bakery", "Shopping", "Supermarket", "Taxi Rank", "Other"];

const categoryColors = {
  "Restaurant": "bg-orange-100 text-orange-800 border-orange-200",
  "Tourist Attraction": "bg-purple-100 text-purple-800 border-purple-200",
  "Hotel": "bg-blue-100 text-blue-800 border-blue-200",
  "Supermarket": "bg-green-100 text-green-800 border-green-200",
  "Bar": "bg-red-100 text-red-800 border-red-200",
  "Bakery": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Taxi Rank": "bg-gray-100 text-gray-800 border-gray-200",
  "Cafe": "bg-amber-100 text-amber-800 border-amber-200",
  "Shopping": "bg-pink-100 text-pink-800 border-pink-200",
  "Other": "bg-slate-100 text-slate-800 border-slate-200"
};

const categoryEmojis = {
  "Restaurant": "🍽️", "Bar": "🍺", "Cafe": "☕", "Hotel": "🏨",
  "Tourist Attraction": "🏛️", "Bakery": "🥐", "Shopping": "🛍️",
  "Supermarket": "🛒", "Taxi Rank": "🚕", "Other": "📍"
};

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className={`w-3.5 h-3.5 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200"}`} />
      ))}
    </div>
  );
}

export default function Discover() {
  const [places, setPlaces] = useState([]);
  const [exhibitions, setExhibitions] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [userNumbers, setUserNumbers] = useState({});
  const [taxiDialogOpen, setTaxiDialogOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userRatings, setUserRatings] = useState({});
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [expandedPlaceId, setExpandedPlaceId] = useState(null);

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadUserRatings = async (email) => {
    const ratings = await base44.entities.PlaceRating.filter({ user_email: email });
    const ratingsMap = {};
    ratings.forEach(r => { ratingsMap[r.place_id] = r.rating; });
    setUserRatings(ratingsMap);
  };

  const loadPlaces = async () => {
    const user = await base44.auth.me();
    setCurrentUserEmail(user.email);

    const [allPlaces, allExhibitions] = await Promise.all([
      base44.entities.Place.filter({ is_public: true }),
      base44.entities.Exhibition.list()
    ]);

    // Filter out flagged places
    const validPlaces = allPlaces.filter(p => !p.is_flagged);

    const exMap = {};
    allExhibitions.forEach(ex => { exMap[ex.id] = ex; });
    setExhibitions(exMap);
    
    const userMap = {};
    const uniqueEmails = [...new Set(validPlaces.map(p => p.created_by))];
    for (const email of uniqueEmails) {
      const users = await base44.entities.User.filter({ email });
      if (users.length > 0) {
        userMap[email] = users[0].user_number || email;
      }
    }
    setUserNumbers(userMap);
    
    // Calculate community score and sort
    const withScores = validPlaces.map(p => ({
      ...p,
      communityScore: (p.community_upvotes || 0) - (p.community_downvotes || 0)
    }));
    const sorted = withScores.sort((a, b) => {
      // Primary: community score
      if (b.communityScore !== a.communityScore) return b.communityScore - a.communityScore;
      // Secondary: personal rating
      return (b.rating || 0) - (a.rating || 0);
    });
    setPlaces(sorted);
    
    await loadUserRatings(user.email);
    setLoading(false);
  };

  const handleRating = async (placeId, newRating) => {
    const existingRatings = await base44.entities.PlaceRating.filter({ place_id: placeId, user_email: currentUserEmail });
    
    if (existingRatings.length > 0) {
      const existing = existingRatings[0];
      if (existing.rating === newRating) {
        // Remove rating if clicking same button
        await base44.entities.PlaceRating.delete(existing.id);
        setUserRatings({ ...userRatings, [placeId]: null });
      } else {
        // Update to opposite rating
        await base44.entities.PlaceRating.update(existing.id, { rating: newRating });
        setUserRatings({ ...userRatings, [placeId]: newRating });
      }
    } else {
      // Create new rating
      await base44.entities.PlaceRating.create({ place_id: placeId, user_email: currentUserEmail, rating: newRating });
      setUserRatings({ ...userRatings, [placeId]: newRating });
    }

    // Recalculate place votes
    const allRatings = await base44.entities.PlaceRating.filter({ place_id: placeId });
    const upvotes = allRatings.filter(r => r.rating === "up").length;
    const downvotes = allRatings.filter(r => r.rating === "down").length;
    
    // Auto-flag if downvotes exceed threshold
    const shouldFlag = downvotes >= 5 && downvotes > upvotes * 2;
    
    await base44.entities.Place.update(placeId, {
      community_upvotes: upvotes,
      community_downvotes: downvotes,
      is_flagged: shouldFlag
    });

    // Reload places to reflect changes
    loadPlaces();
  };

  const filtered = places.filter(p => {
    const searchLower = search.toLowerCase();
    const matchesSearch = !search || 
      p.name?.toLowerCase().includes(searchLower) ||
      p.address?.toLowerCase().includes(searchLower) ||
      p.notes?.toLowerCase().includes(searchLower) ||
      (p.attributes || []).some(a => a.toLowerCase().includes(searchLower));
    const matchesCategory = selectedCategory === "All" || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 pt-8 pb-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-4xl mb-3">🌍</div>
          <h1 className="text-3xl font-bold mb-2">Community Discover</h1>
          <p className="text-blue-100 text-sm">
            Rated places shared by the CardScan Pro community at exhibitions worldwide
          </p>
        </div>
      </div>

      {/* Search & Filter — floated up over hero */}
      <div className="max-w-2xl mx-auto px-4 -mt-8 mb-6">
        <div className="bg-white rounded-2xl shadow-xl p-4">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search places, features (e.g. Vegan, Pool)..."
              className="pl-9"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  selectedCategory === cat
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-blue-300"
                }`}
              >
                {cat !== "All" && categoryEmojis[cat]} {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-2xl mx-auto px-4 pb-24">
        {loading ? (
          <div className="text-center py-16 text-gray-400">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            Loading places...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">📍</div>
            <p className="font-medium">No places found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500 font-medium">{filtered.length} place{filtered.length !== 1 ? "s" : ""} found</p>
            {filtered.map((place, i) => {
              const exhibition = exhibitions[place.exhibition_id];
              const isExpanded = expandedPlaceId === place.id;
              const isOwnPlace = place.created_by === currentUserEmail;
              return (
                <div 
                  key={place.id} 
                  className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ${
                    isExpanded 
                      ? "shadow-2xl scale-[1.02] border-blue-300" 
                      : "shadow-sm border-gray-100 hover:shadow-lg"
                  }`}
                >
                  {/* Top accent bar based on rating */}
                  <div className={`h-1 ${place.rating >= 4 ? "bg-gradient-to-r from-yellow-400 to-orange-400" : place.rating >= 3 ? "bg-gradient-to-r from-blue-400 to-blue-500" : "bg-gray-100"}`} />
                  
                  <div className="p-4">
                    <button 
                      onClick={() => setExpandedPlaceId(isExpanded ? null : place.id)}
                      className="w-full text-left"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-lg">{categoryEmojis[place.category] || "📍"}</span>
                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{place.name}</h3>
                            {place.category && (
                              <Badge className={`text-xs ${categoryColors[place.category] || "bg-gray-100 text-gray-800"}`}>
                                {place.category}
                              </Badge>
                            )}
                          </div>

                          {place.rating > 0 && (
                            <div className="flex items-center gap-2 mb-2">
                              <StarRating rating={place.rating} />
                              <span className="text-sm font-semibold text-gray-700">{place.rating}/5</span>
                            </div>
                          )}

                          {place.address && (
                            <div className="flex items-start gap-1.5 text-sm text-gray-500 mb-2">
                              <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-2">{place.address}</span>
                            </div>
                          )}

                          {place.attributes && place.attributes.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {place.attributes.map(attr => (
                                <span key={attr} className="inline-block bg-blue-50 text-blue-700 border border-blue-100 rounded-full px-2 py-0.5 text-xs font-medium">
                                  ✓ {attr}
                                </span>
                              ))}
                            </div>
                          )}

                          {place.notes && (
                            <p className="text-sm text-gray-600 italic bg-gray-50 rounded-lg px-3 py-2 mb-2 line-clamp-2">
                              "{place.notes}"
                            </p>
                          )}

                          {exhibition && (
                            <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                              <span>📅</span>
                              <span>{exhibition.name}{exhibition.location ? ` · ${exhibition.location}` : ""}</span>
                            </div>
                          )}

                          <div className="text-xs text-gray-400 mt-2">
                            Posted by {userNumbers[place.created_by] || place.created_by}
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* Community Rating - Always visible */}
                    {!isOwnPlace && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-gray-700">Community Rating:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRating(place.id, "up"); }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
                                userRatings[place.id] === "up"
                                  ? "bg-green-500 text-white border-2 border-green-600 scale-105"
                                  : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-green-50 hover:border-green-400"
                              }`}
                            >
                              <ThumbsUp className="w-4 h-4" />
                              <span className="font-bold">{place.community_upvotes || 0}</span>
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); handleRating(place.id, "down"); }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all shadow-sm ${
                                userRatings[place.id] === "down"
                                  ? "bg-red-500 text-white border-2 border-red-600 scale-105"
                                  : "bg-white text-gray-700 border-2 border-gray-300 hover:bg-red-50 hover:border-red-400"
                              }`}
                            >
                              <ThumbsDown className="w-4 h-4" />
                              <span className="font-bold">{place.community_downvotes || 0}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Expanded Actions - Only show when expanded */}
                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
                        {place.website && (
                          <a
                            href={place.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Visit Website
                          </a>
                        )}
                        {place.address && (
                          <>
                            <a
                              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place.address)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-800 font-medium"
                            >
                              <Navigation className="w-3.5 h-3.5" />
                              Get Directions
                            </a>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedPlace(place);
                                setTaxiDialogOpen(true);
                              }}
                              className="flex items-center gap-1.5 text-sm text-orange-600 hover:text-orange-800 font-medium"
                            >
                              🚕 Book Taxi
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BookTaxiDialog
        open={taxiDialogOpen}
        onOpenChange={setTaxiDialogOpen}
        defaultDestination={selectedPlace?.address || selectedPlace?.name || ""}
      />
    </div>
  );
}