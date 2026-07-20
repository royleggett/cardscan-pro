import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Users, MapPin, Settings2, Plus, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

import ContactCard from "@/components/contacts/ContactCard";
import ExportCsvDialog from "@/components/contacts/ExportCsvDialog";
import EditExhibitionDialog from "@/components/exhibitions/EditExhibitionDialog";
import TeamCodeDisplay from "@/components/exhibitions/TeamCodeDisplay";
import AddPlaceDialog from "@/components/places/AddPlaceDialog";
import PlaceCard from "@/components/places/PlaceCard";
import { isDemoUser, showDemoRestriction } from "@/lib/demoMode";

export default function ExhibitionDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const exhibitionId = urlParams.get("id");

  const [exhibition, setExhibition] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("contacts");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [user, setUser] = useState(null);
  const [defaultTags, setDefaultTags] = useState([]);

  useEffect(() => {
    loadData();
  }, [exhibitionId]);

  const loadData = async () => {
    if (!exhibitionId) {
      setLoading(false);
      return;
    }
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setDefaultTags(currentUser?.default_tags || []);

      const [exList, contactsList, placesList] = await Promise.all([
        base44.entities.Exhibition.filter({ id: exhibitionId }),
        base44.entities.Contact.filter({ exhibition_id: exhibitionId }, "-created_date"),
        base44.entities.Place.filter({ exhibition_id: exhibitionId }, "-created_date")
      ]);

      setExhibition(exList[0] || null);
      setContacts(contactsList);
      setPlaces(placesList);
    } catch {
      base44.auth.redirectToLogin();
    }
    setLoading(false);
  };

  const handleSaveExhibition = async (data) => {
    if (isDemoUser(user)) {
      showDemoRestriction();
      setShowEditDialog(false);
      return;
    }
    await base44.entities.Exhibition.update(exhibitionId, data);
    setShowEditDialog(false);
    loadData();
  };

  const handleDeleteExhibition = async () => {
    if (isDemoUser(user)) {
      showDemoRestriction();
      setShowEditDialog(false);
      return;
    }
    // Delete all contacts and places first
    await Promise.all([
      ...contacts.map(c => base44.entities.Contact.delete(c.id)),
      ...places.map(p => base44.entities.Place.delete(p.id))
    ]);
    await base44.entities.Exhibition.delete(exhibitionId);
    navigate(createPageUrl("Exhibitions"));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!exhibition) {
    return (
      <div className="px-4 py-6 text-center">
        <p className="text-gray-500">Exhibition not found.</p>
        <Button variant="ghost" onClick={() => navigate(createPageUrl("Exhibitions"))} className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  const isOwner = exhibition.created_by === user?.email;
  const memberCount = (exhibition.team_members || []).length;

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => navigate(createPageUrl("Exhibitions"))}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        {isOwner && (
          <Button variant="ghost" size="icon" onClick={() => setShowEditDialog(true)}>
            <Settings2 className="w-5 h-5 text-gray-500" />
          </Button>
        )}
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900">{exhibition.name}</h1>
          {!isOwner && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              <Users className="w-3 h-3 mr-1" />
              Team
            </Badge>
          )}
        </div>
        {exhibition.location && (
          <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {exhibition.location}
          </p>
        )}
        {(exhibition.from_date || exhibition.to_date) && (
          <p className="text-sm text-gray-500 mt-0.5">
            📅 {exhibition.from_date ? format(new Date(exhibition.from_date), "MMM d, yyyy") : ""}
            {exhibition.from_date && exhibition.to_date ? " – " : ""}
            {exhibition.to_date ? format(new Date(exhibition.to_date), "MMM d, yyyy") : ""}
          </p>
        )}
        {exhibition.hotel && (
          <p className="text-sm text-gray-500 mt-0.5">🏨 {exhibition.hotel}</p>
        )}
        {exhibition.notes && (
          <p className="text-sm text-gray-500 mt-0.5 italic">{exhibition.notes}</p>
        )}
      </div>

      {isOwner && exhibition.team_code && (
        <div className="mb-6">
          <TeamCodeDisplay code={exhibition.team_code} memberCount={memberCount} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setActiveTab("contacts")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${activeTab === "contacts" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700 active:scale-95"}`}
        >
          Contacts ({contacts.length})
        </button>
        <button
          onClick={() => setActiveTab("places")}
          className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-150 ${activeTab === "places" ? "bg-white shadow text-blue-600" : "text-gray-500 hover:text-gray-700 active:scale-95"}`}
        >
          Places ({places.length})
        </button>
      </div>

      {/* Scan / Add + Export buttons */}
      <div className="mb-4 space-y-2">
        {activeTab === "contacts" ? (
          <>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-base transition-all duration-150 active:scale-95 active:bg-blue-800"
              onClick={() => navigate(createPageUrl(`ScanCard?exhibition_id=${exhibitionId}`))}
            >
              <Camera className="w-5 h-5 mr-2" />
              Scan Business Card
            </Button>
            {contacts.length > 0 && (
              <Button
                variant="outline"
                className="w-full h-11 transition-all duration-150 active:scale-95"
                onClick={() => setShowExport(true)}
              >
                <Download className="w-4 h-4 mr-2" />
                Export {contacts.length} Contact{contacts.length !== 1 ? 's' : ''} (CSV)
              </Button>
            )}
          </>
        ) : (
          <Button
            className="w-full bg-green-600 hover:bg-green-700 h-14 text-base transition-all duration-150 active:scale-95 active:bg-green-800"
            onClick={() => setShowAddPlace(true)}
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Place
          </Button>
        )}
      </div>

      {/* Tab Content */}
      {activeTab === "contacts" && (
        <div className="space-y-3">
          {contacts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Camera className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No contacts yet. Start scanning!</p>
            </div>
          ) : (
            contacts.map(contact => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onUpdate={loadData}
                defaultTags={defaultTags}
                isOwner={isOwner}
                isOwnContact={contact.created_by === user?.email}
              />
            ))
          )}
        </div>
      )}

      {activeTab === "places" && (
        <div className="space-y-3">
          {places.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No places added yet.</p>
            </div>
          ) : (
            places.map(place => (
              <PlaceCard
                key={place.id}
                place={place}
                onUpdate={loadData}
                isOwner={isOwner || place.created_by === user?.email}
              />
            ))
          )}
        </div>
      )}

      {isOwner && (
        <EditExhibitionDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          exhibition={exhibition}
          onSave={handleSaveExhibition}
          onDelete={handleDeleteExhibition}
        />
      )}

      <AddPlaceDialog
        open={showAddPlace}
        onOpenChange={setShowAddPlace}
        exhibitionId={exhibitionId}
        onPlaceAdded={loadData}
      />

      <ExportCsvDialog
        contacts={contacts}
        open={showExport}
        onOpenChange={setShowExport}
        defaultFileName={exhibition?.name?.toLowerCase().replace(/\s+/g, '_') || 'exhibition_contacts'}
      />
    </div>
  );
}