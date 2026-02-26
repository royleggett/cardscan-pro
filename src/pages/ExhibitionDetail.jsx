import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
const Exhibition = base44.entities.Exhibition;
const Contact = base44.entities.Contact;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Search, Download, Settings, MapPin, Car, ScanLine, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import ContactCard from "../components/contacts/ContactCard";
import EditExhibitionDialog from "../components/exhibitions/EditExhibitionDialog";
import AddPlaceDialog from "../components/places/AddPlaceDialog";
import PlaceCard from "../components/places/PlaceCard";
import BookTaxiDialog from "../components/taxi/BookTaxiDialog";

export default function ExhibitionDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const exhibitionId = urlParams.get("id");
  
  const [exhibition, setExhibition] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showAddPlace, setShowAddPlace] = useState(false);
  const [showBookTaxi, setShowBookTaxi] = useState(false);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [defaultTags, setDefaultTags] = useState([]);

  useEffect(() => {
    if (exhibitionId) {
      loadData();
    }
  }, [exhibitionId]);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      
      const [exList, contactsList, myPlaces, publicPlaces] = await Promise.all([
        Exhibition.filter({ id: exhibitionId, created_by: currentUser.email }),
        Contact.filter({ exhibition_id: exhibitionId, created_by: currentUser.email }, "-created_date"),
        base44.entities.Place.filter({ exhibition_id: exhibitionId, created_by: currentUser.email }, "-created_date"),
        base44.entities.Place.filter({ exhibition_id: exhibitionId, is_public: true }, "-created_date")
      ]);

      const ex = exList[0];
      if (!ex) {
        navigate(createPageUrl("Exhibitions"));
        return;
      }
      
      setExhibition(ex);
      setContacts(contactsList);
      
      const otherUsersPublicPlaces = publicPlaces.filter(p => p.created_by !== currentUser.email);
      setPlaces([...myPlaces, ...otherUsersPublicPlaces]);
      setDefaultTags(currentUser?.default_tags || []);
      setLoading(false);
    } catch (err) {
      base44.auth.redirectToLogin();
    }
  };

  const handleSaveExhibition = async (updatedData) => {
    await Exhibition.update(exhibitionId, updatedData);
    setShowEdit(false);
    loadData();
  };

  const handleDeleteExhibition = async () => {
    for (const contact of contacts) {
      await Contact.delete(contact.id);
    }
    await Exhibition.delete(exhibitionId);
    navigate(createPageUrl("Exhibitions"));
  };

  const exportToExcel = async () => {
    const exportData = contacts.map(contact => ({
      'Exhibition': exhibition?.name || '',
      'Name': contact.full_name || '',
      'Company': contact.company || '',
      'Position': contact.position || '',
      'Email': contact.email || '',
      'Mobile': contact.phone_mobile || '',
      'Landline': contact.phone_landline || '',
      'Fax': contact.phone_fax || '',
      'Other Phone': contact.phone_other || '',
      'Country/Area': contact.country || '',
      'Website': contact.website || '',
      'Address': contact.address || '',
      'Notes': contact.notes || '',
      'Tags': (contact.tags || []).join(', '),
      'Lead Temperature': contact.follow_up_type || ''
    }));

    const headers = Object.keys(exportData[0] || {});
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => {
        const value = String(row[header]).replace(/"/g, '""');
        return `"${value}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName || exhibition?.name || 'exhibition'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowExport(false);
    setFileName("");
  };

  const filteredContacts = contacts.filter(contact => {
    const query = searchQuery.toLowerCase();
    return (
      (contact.full_name?.toLowerCase().includes(query)) ||
      (contact.company?.toLowerCase().includes(query)) ||
      (contact.email?.toLowerCase().includes(query)) ||
      (contact.country?.toLowerCase().includes(query))
    );
  });

  if (loading || !exhibition) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6 pb-24">
      <div className="max-w-7xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Exhibitions"))}
          className="mb-6 hover:bg-white/50"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Exhibitions
        </Button>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 mb-6 border-2 border-blue-100">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{exhibition.name}</h1>
              {exhibition.location && (
                <div className="flex items-center gap-2 text-gray-600 mb-1">
                  <MapPin className="w-4 h-4" />
                  <span>{exhibition.location}</span>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {contacts.length} contact{contacts.length !== 1 ? 's' : ''} • {places.length} place{places.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowEdit(true)}
                className="bg-white hover:bg-gray-50"
              >
                <Settings className="w-4 h-4" />
              </Button>
              
              {contacts.length > 0 && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setFileName(exhibition?.name || '');
                    setShowExport(true);
                  }}
                  className="bg-white hover:bg-gray-50"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export CSV
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Link to={createPageUrl(`ScanCard?exhibition_id=${exhibitionId}`)}>
              <Button className="w-full h-16 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg">
                <ScanLine className="w-5 h-5" />
                <span className="text-xs font-medium">Add Contact</span>
              </Button>
            </Link>
            <Button
              onClick={() => setShowAddPlace(true)}
              className="w-full h-16 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-lg"
            >
              <Building2 className="w-5 h-5" />
              <span className="text-xs font-medium">Add Place</span>
            </Button>
            <Button
              onClick={() => setShowBookTaxi(true)}
              className="w-full h-16 flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg"
            >
              <Car className="w-5 h-5" />
              <span className="text-xs font-medium">Book Taxi</span>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="contacts">Contacts ({contacts.length})</TabsTrigger>
            <TabsTrigger value="places">Places ({places.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            {contacts.length > 0 && (
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 h-12 bg-white/80 backdrop-blur-sm border-2 border-gray-200 focus:border-blue-400"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              {filteredContacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onUpdate={loadData}
                  defaultTags={defaultTags}
                />
              ))}
            </div>

            {contacts.length === 0 && (
              <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No contacts yet</h3>
                <p className="text-gray-500 mb-4">Click "Add Contact" above to scan your first business card</p>
              </div>
            )}

            {filteredContacts.length === 0 && contacts.length > 0 && (
              <div className="text-center py-16 bg-white/50 backdrop-blur-sm rounded-2xl text-gray-500">
                No contacts match your search
              </div>
            )}
          </TabsContent>

          <TabsContent value="places">
            <div className="space-y-4">
              {places.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onUpdate={loadData}
                />
              ))}
            </div>

            {places.length === 0 && (
              <div className="text-center py-20 bg-white/50 backdrop-blur-sm rounded-2xl">
                <div className="w-24 h-24 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center mx-auto mb-6">
                  <MapPin className="w-12 h-12 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No places yet</h3>
                <p className="text-gray-500 mb-4">Click "Add Place" above to save your first location</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <EditExhibitionDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        exhibition={exhibition}
        onSave={handleSaveExhibition}
        onDelete={handleDeleteExhibition}
      />

      <AddPlaceDialog
        open={showAddPlace}
        onOpenChange={setShowAddPlace}
        exhibitionId={exhibitionId}
        onPlaceAdded={loadData}
      />

      <BookTaxiDialog
        open={showBookTaxi}
        onOpenChange={setShowBookTaxi}
        defaultDestination={exhibition?.location || ""}
      />

      <Dialog open={showExport} onOpenChange={setShowExport}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export to CSV</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="filename">File Name</Label>
              <Input
                id="filename"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
              />
              <p className="text-xs text-gray-500 mt-1">.csv will be added automatically</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExport(false)}>
              Cancel
            </Button>
            <Button onClick={exportToExcel} className="bg-blue-600 hover:bg-blue-700">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}