import React, { useState } from "react";
import { Contact } from "@/entities/Contact";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Mail, Phone, Globe, MapPin, Trash2, ChevronDown, ChevronUp, Flag, Pencil, Flame, Thermometer, Snowflake, X, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";

const INDUSTRY_TAGS = ["Buyer", "Owner", "Decision Maker", "Technician", "Installer", "Sales", "Marketing"];

const LEAD_CONFIG = {
  hot:  { label: "Hot",  icon: Flame,       bg: "bg-red-100",    text: "text-red-700"    },
  warm: { label: "Warm", icon: Thermometer, bg: "bg-amber-100",  text: "text-amber-700"  },
  cool: { label: "Cool", icon: Snowflake,   bg: "bg-blue-100",   text: "text-blue-700"   },
  none: { label: "None", icon: null,        bg: "bg-gray-100",   text: "text-gray-500"   },
};
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

import EditContactDialog from "./EditContactDialog";

export default function ContactCard({ contact, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [savingTag, setSavingTag] = useState(false);
  const [newTag, setNewTag] = useState("");

  const handleDelete = async () => {
    await Contact.delete(contact.id);
    onUpdate();
  };

  const handleSaveEdit = async (updatedData) => {
    await Contact.update(contact.id, updatedData);
    setShowEdit(false);
    onUpdate();
  };

  const handleLeadChange = async (type) => {
    await Contact.update(contact.id, { follow_up_type: type });
    onUpdate();
  };

  const handleTagToggle = async (tag) => {
    setSavingTag(true);
    const current = contact.tags || [];
    const updated = current.includes(tag) ? current.filter(t => t !== tag) : [...current, tag];
    await Contact.update(contact.id, { tags: updated });
    setSavingTag(false);
    onUpdate();
  };

  const handleAddCustomTag = async () => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    const current = contact.tags || [];
    if (current.includes(trimmed)) { setNewTag(""); return; }
    setSavingTag(true);
    await Contact.update(contact.id, { tags: [...current, trimmed] });
    setNewTag("");
    setSavingTag(false);
    onUpdate();
  };

  const handleRemoveTag = async (tag) => {
    setSavingTag(true);
    const updated = (contact.tags || []).filter(t => t !== tag);
    await Contact.update(contact.id, { tags: updated });
    setSavingTag(false);
    onUpdate();
  };

  return (
    <>
      <Card className="bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200">
        <CardContent className="p-5">
          <div className="flex justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-xl text-gray-900 mb-3">{contact.full_name}</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {contact.company && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 px-3 py-1">
                    <Building2 className="w-3 h-3 mr-1" />
                    {contact.company}
                  </Badge>
                )}
                {contact.country && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800 px-3 py-1">
                    <Flag className="w-3 h-3 mr-1" />
                    {contact.country}
                  </Badge>
                )}
                {(contact.tags || []).map(tag => (
                  <Badge key={tag} variant="secondary" className="bg-purple-100 text-purple-800 px-3 py-1">
                    {tag}
                  </Badge>
                ))}
                {contact.follow_up_type && contact.follow_up_type !== "none" && (() => {
                  const cfg = LEAD_CONFIG[contact.follow_up_type];
                  const Icon = cfg?.icon;
                  return (
                    <Badge variant="secondary" className={`${cfg?.bg} ${cfg?.text} px-3 py-1`}>
                      {Icon && <Icon className="w-3 h-3 mr-1" />}
                      {cfg?.label} Lead
                    </Badge>
                  );
                })()}
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowEdit(true)}
                className="hover:bg-blue-50 hover:text-blue-600"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setExpanded(!expanded)}
                className="hover:bg-gray-100"
              >
                {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {contact.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                <Mail className="w-4 h-4" />
                {contact.email}
              </a>
            )}
            {contact.phone_mobile && (
              <a href={`tel:${contact.phone_mobile}`} className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600">
                <Phone className="w-4 h-4" />
                Mobile: {contact.phone_mobile}
              </a>
            )}
          </div>

          {expanded && (
            <div className="mt-4 pt-4 border-t space-y-3">
              {contact.position && (
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Position:</span> {contact.position}
                </div>
              )}
              {contact.phone_landline && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  Landline: {contact.phone_landline}
                </div>
              )}
              {contact.phone_fax && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  Fax: {contact.phone_fax}
                </div>
              )}
              {contact.phone_other && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  Other: {contact.phone_other}
                </div>
              )}
              {contact.website && (
                <a href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                  <Globe className="w-4 h-4" />
                  {contact.website}
                </a>
              )}
              {contact.address && (
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  {contact.address}
                </div>
              )}
              {contact.notes && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <span className="font-semibold">Notes:</span> {contact.notes}
                </div>
              )}
              {contact.card_image_url && (
                <div className="mt-4 space-y-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-2">Card Front:</p>
                    <img src={contact.card_image_url} alt="Card Front" className="w-full rounded-lg border" />
                  </div>
                  {contact.card_image_back_url && (
                    <div>
                      <p className="text-xs text-gray-500 mb-2">Card Back:</p>
                      <img src={contact.card_image_back_url} alt="Card Back" className="w-full rounded-lg border" />
                    </div>
                  )}
                </div>
              )}
              <div>
                <p className="text-xs text-gray-500 font-semibold mb-2">Tags</p>
                <div className="flex gap-2 flex-wrap mb-2">
                  {INDUSTRY_TAGS.map(tag => {
                    const isActive = (contact.tags || []).includes(tag);
                    return isActive ? (
                      <span
                        key={tag}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border-2 bg-purple-100 text-purple-800 border-purple-300"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          disabled={savingTag}
                          className="ml-0.5 hover:text-red-500"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ) : (
                      <button
                        key={tag}
                        onClick={() => handleTagToggle(tag)}
                        disabled={savingTag}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold border-2 bg-white text-gray-400 border-gray-200 hover:border-purple-200 transition-all"
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
                {/* Custom tags */}
                {(contact.tags || []).filter(t => !INDUSTRY_TAGS.includes(t)).length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-2">
                    {(contact.tags || []).filter(t => !INDUSTRY_TAGS.includes(t)).map(tag => (
                      <span key={tag} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border-2 border-purple-300">
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} disabled={savingTag} className="ml-1 hover:text-red-500">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {/* Add custom tag */}
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && handleAddCustomTag()}
                    placeholder="Add custom tag..."
                    className="h-8 text-xs"
                  />
                  <button
                    onClick={handleAddCustomTag}
                    disabled={savingTag || !newTag.trim()}
                    className="px-3 py-1.5 rounded-md bg-purple-100 text-purple-800 text-xs font-semibold hover:bg-purple-200 disabled:opacity-40"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 font-semibold mb-2">Lead Temperature</p>
                <div className="flex gap-2 flex-wrap">
                  {["hot","warm","cool","none"].map(type => {
                    const cfg = LEAD_CONFIG[type];
                    const Icon = cfg.icon;
                    const isActive = (contact.follow_up_type || "none") === type;
                    return (
                      <button
                        key={type}
                        onClick={() => handleLeadChange(type)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all ${
                          isActive ? `${cfg.bg} ${cfg.text} border-current` : "bg-white text-gray-400 border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {Icon && <Icon className="w-3 h-3" />}
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button 
                variant="outline" 
                className="w-full text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200" 
                onClick={() => setShowDelete(true)}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Contact
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <EditContactDialog
        open={showEdit}
        onOpenChange={setShowEdit}
        contact={contact}
        onSave={handleSaveEdit}
      />

      <AlertDialog open={showDelete} onOpenChange={setShowDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete {contact.full_name}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}