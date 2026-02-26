import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MapPin, Star, ExternalLink, Search, Filter, Navigation } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    const [allPlaces, allExhibitions] = await Promise.all([
      base44.entities.Place.filter({ is_public: true }),
      base44.entities.Exhibition.list()
    ]);
    const exMap = {};
    allExhibitions.forEach(ex => { exMap[ex.id] = ex; });
    setExhibitions(exMap);
    // Sort by rating descending
    const sorted = allPlaces.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    setPlaces(sorted);
    setLoading(false);
  };

  const filtered = places.filter(p => {
    const matchesSearch = !search || 
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.address?.toLowerCase().includes(search.toLowerCase()) ||
      p.notes?.toLowerCase().includes(search.toLowerCase());
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
              placeholder="Search places, addresses..."
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
              return (
                <div key={place.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                  {/* Top accent bar based on rating */}
                  <div className={`h-1 ${place.rating >= 4 ? "bg-gradient-to-r from-yellow-400 to-orange-400" : place.rating >= 3 ? "bg-gradient-to-r from-blue-400 to-blue-500" : "bg-gray-100"}`} />
                  
                  <div className="p-4">
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
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {place.website && (
                        <a
                          href={place.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Visit Website
                        </a>
                      )}
                      {place.address && (
                        <a
                          href={`https://www.rome2rio.com/s/${encodeURIComponent(place.address)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm text-green-600 hover:text-green-800 font-medium"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          Get Directions
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}