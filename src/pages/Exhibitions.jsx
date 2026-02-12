import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Exhibition } from "@/entities/Exhibition";
import { Contact } from "@/entities/Contact";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Plus, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Exhibitions() {
  const [exhibitions, setExhibitions] = useState([]);
  const [contactCounts, setContactCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExhibitions();
  }, []);

  const loadExhibitions = async () => {
    try {
      const currentUser = await base44.auth.me();
      
      const list = await Exhibition.filter({ created_by: currentUser.email }, "-created_date");
      setExhibitions(list);
      
      const counts = {};
      for (const exhibition of list) {
        const contacts = await Contact.filter({ 
          exhibition_id: exhibition.id,
          created_by: currentUser.email
        });
        counts[exhibition.id] = contacts.length;
      }
      setContactCounts(counts);
      setLoading(false);
    } catch (err) {
      base44.auth.redirectToLogin();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6">
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading exhibitions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Exhibitions</h1>
            <p className="text-gray-600 mt-1">{exhibitions.length} exhibition{exhibitions.length !== 1 ? 's' : ''}</p>
          </div>
          <Link to={createPageUrl("NewExhibition")}>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg">
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
          </Link>
        </div>

        <div className="grid gap-4">
          {exhibitions.map((ex) => (
            <Link key={ex.id} to={createPageUrl(`ExhibitionDetail?id=${ex.id}`)}>
              <Card className="hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-2 hover:border-blue-200">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-gray-900 mb-3">{ex.name}</h3>
                      <div className="space-y-2">
                        {ex.location && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span className="text-sm">{ex.location}</span>
                          </div>
                        )}
                        {(ex.from_date || ex.to_date) && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span className="text-sm">
                              {ex.from_date && new Date(ex.from_date).toLocaleDateString()}
                              {ex.from_date && ex.to_date && " - "}
                              {ex.to_date && new Date(ex.to_date).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 text-lg px-4 py-2">
                      {contactCounts[ex.id] || 0} {contactCounts[ex.id] === 1 ? 'contact' : 'contacts'}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {exhibitions.length === 0 && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No exhibitions yet</h3>
            <p className="text-gray-500 mb-6">Create your first exhibition to start scanning cards</p>
            <Link to={createPageUrl("NewExhibition")}>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create First Exhibition
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}