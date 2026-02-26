import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
const Contact = base44.entities.Contact;
const Exhibition = base44.entities.Exhibition;
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Download, Flame, Thermometer, Snowflake, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import ContactCard from "../components/contacts/ContactCard";

export default function AllContacts() {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [exhibitions, setExhibitions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [leadFilter, setLeadFilter] = useState("all");
  const [showExport, setShowExport] = useState(false);
  const [fileName, setFileName] = useState("all_contacts");
  const [defaultTags, setDefaultTags] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const currentUser = await base44.auth.me();
      
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
    }
  };

  const exportToExcel = async () => {
    const exportData = contacts.map(contact => ({
      'Exhibition': exhibitions[contact.exhibition_id] || '',
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
    link.setAttribute('download', `${fileName || 'all_contacts'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setShowExport(false);
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

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate(createPageUrl("Home"))}
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