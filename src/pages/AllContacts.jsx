import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
const Contact = base44.entities.Contact;
const Exhibition = base44.entities.Exhibition;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Download, Flame, Thermometer, Snowflake, Users, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

import ContactCard from "../components/contacts/ContactCard";
import ExportCsvDialog from "../components/contacts/ExportCsvDialog";

export default function AllContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [exhibitions, setExhibitions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [leadFilter, setLeadFilter] = useState("all");
  const [showExport, setShowExport] = useState(false);
  const [defaultTags, setDefaultTags] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      const [contactsList, exhibitionsList] = await Promise.all([
        Contact.filter({ created_by: currentUser.email }, "-created_date"),
        Exhibition.filter({ created_by: currentUser.email })
      ]);
      
      const exhibitionsMap = {};
      exhibitionsList.forEach(ex => {
        exhibitionsMap[ex.id] = ex.name;
      });
      
      setDefaultTags(currentUser?.default_tags || []);
      setContacts(contactsList);
      setExhibitions(exhibitionsMap);
    } catch (err) {
      base44.auth.redirectToLogin();
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = (
      (contact.full_name?.toLowerCase().includes(query)) ||
      (contact.company?.toLowerCase().includes(query)) ||
      (contact.email?.toLowerCase().includes(query)) ||
      (contact.country?.toLowerCase().includes(query)) ||
      (exhibitions[contact.exhibition_id]?.toLowerCase().includes(query))
    );
    const matchesLead = leadFilter === "all" || (contact.follow_up_type || "none") === leadFilter;
    return matchesSearch && matchesLead;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isFreeUser = !isAdmin && (!user?.subscription_tier || user.subscription_tier === 'free');

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Contacts</h1>
          <p className="text-gray-500 text-sm mt-1">
            {contacts.length} contact{contacts.length !== 1 ? 's' : ''} across all exhibitions
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => setShowExport(true)}
          disabled={contacts.length === 0}
          className="transition-all duration-150 active:scale-95"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {contacts.length > 0 && (
        <div className="mb-6 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search contacts or exhibitions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { key: "all",  label: "All",  icon: Users,       color: "bg-gray-800 text-white",    inactive: "bg-white text-gray-500 border border-gray-200" },
              { key: "hot",  label: "Hot",  icon: Flame,       color: "bg-red-500 text-white",     inactive: "bg-white text-red-400 border border-red-200" },
              { key: "warm", label: "Warm", icon: Thermometer, color: "bg-amber-500 text-white",   inactive: "bg-white text-amber-500 border border-amber-200" },
              { key: "cool", label: "Cool", icon: Snowflake,   color: "bg-blue-500 text-white",    inactive: "bg-white text-blue-400 border border-blue-200" },
              { key: "none", label: "Unset",icon: null,        color: "bg-gray-400 text-white",    inactive: "bg-white text-gray-400 border border-gray-200" },
            ].map(({ key, label, icon: Icon, color, inactive }) => (
              <button
                key={key}
                onClick={() => setLeadFilter(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${leadFilter === key ? color : inactive}`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {label}
                <span className="ml-0.5 opacity-70 text-xs">
                  ({contacts.filter(c => key === "all" ? true : (c.follow_up_type || "none") === key).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {filteredContacts.map((contact) => (
          <div key={contact.id}>
            {exhibitions[contact.exhibition_id] && (
              <p className="text-xs text-gray-500 mb-1 ml-1">
                {exhibitions[contact.exhibition_id]}
              </p>
            )}
            <ContactCard
              contact={contact}
              onUpdate={loadData}
              defaultTags={defaultTags}
            />
          </div>
        ))}
      </div>

      {isFreeUser && contacts.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <Lock className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="flex-grow">
              <h3 className="font-semibold text-blue-900 mb-2">Upgrade to view all features</h3>
              <p className="text-blue-700 text-sm mb-4">
                You can view your {contacts.length} scanned contacts, but for unlimited scanning and full access to team features, consider upgrading to Premium.
              </p>
              <Button
                onClick={() => navigate(createPageUrl("Pricing"))}
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-150 active:scale-95 active:bg-blue-800"
              >
                View Pricing
              </Button>
            </div>
          </div>
        </div>
      )}

      {contacts.length === 0 && (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No contacts yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start scanning business cards to add contacts
          </p>
        </div>
      )}

      {filteredContacts.length === 0 && contacts.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          No contacts match your search
        </div>
      )}

      <ExportCsvDialog
        contacts={contacts}
        open={showExport}
        onOpenChange={setShowExport}
        defaultFileName="all_contacts"
        exhibitionMap={exhibitions}
      />
    </div>
  );
}