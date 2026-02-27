import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, QrCode, UserPlus, Download, Pencil, MapPin, Calendar, Bed, StickyNote, Users } from "lucide-react";
import ContactCard from "@/components/contacts/ContactCard";
import EditExhibitionDialog from "@/components/exhibitions/EditExhibitionDialog";
import TeamCodeDisplay from "@/components/exhibitions/TeamCodeDisplay";

export default function ExhibitionDetail() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const exhibitionId = urlParams.get("id");

  const [exhibition, setExhibition] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [defaultTags, setDefaultTags] = useState([]);
  const [teamMemberNames, setTeamMemberNames] = useState({});

  useEffect(() => {
    if (exhibitionId) loadData();
  }, [exhibitionId]);

  const loadData = async () => {
    const [user, exList, contactList] = await Promise.all([
      base44.auth.me(),
      base44.entities.Exhibition.filter({ id: exhibitionId }),
      base44.entities.Contact.filter({ exhibition_id: exhibitionId }, "-created_date")
    ]);
    setCurrentUser(user);
    setDefaultTags(user?.default_tags || []);
    if (exList.length > 0) setExhibition(exList[0]);
    setContacts(contactList);

    // Load team member display names
    if (exList[0]?.team_members?.length > 0) {
      const allUsers = await base44.entities.User.list();
      const nameMap = {};
      allUsers.forEach(u => { nameMap[u.email] = u.full_name || u.email; });
      setTeamMemberNames(nameMap);
    }

    setLoading(false);
  };

  const isOwner = exhibition?.created_by === currentUser?.email;
  const isTeamMember = (exhibition?.team_members || []).includes(currentUser?.email);

  const handleSaveExhibition = async (data) => {
    await base44.entities.Exhibition.update(exhibitionId, data);
    setShowEdit(false);
    loadData();
  };

  const handleDeleteExhibition = async () => {
    // Delete all contacts first
    await Promise.all(contacts.map(c => base44.entities.Contact.delete(c.id)));
    await base44.entities.Exhibition.delete(exhibitionId);
    navigate(createPageUrl("Exhibitions"));
  };

  const exportToCSV = () => {
    const rows = contacts.map(c => ({
      "Scanned By": c.created_by || "",
      "Name": c.full_name || "",
      "Company": c.company || "",
      "Position": c.position || "",
      "Email": c.email || "",
      "Mobile": c.phone_mobile || "",
      "Landline": c.phone_landline || "",
      "Fax": c.phone_fax || "",
      "Other Phone": c.phone_other || "",
      "Country": c.country || "",
      "Website": c.website || "",
      "Address": c.address || "",
      "Notes": c.notes || "",
      "Tags": (c.tags || []).join(", "),
      "Lead Temperature": c.follow_up_type || "",
      "Thank You Sent": c.thank_you_sent ? "Yes" : "No"
    }));
    const headers = Object.keys(rows[0] || {});
    const csv = [
      headers.join(","),
      ...rows.map(row => headers.map(h => `"${String(row[h]).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${exhibition.name}_contacts.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDate = (d) => d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
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

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <Button variant="ghost" onClick={() => navigate(createPageUrl("Exhibitions"))} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      {/* Exhibition Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{exhibition.name}</h1>
            {isTeamMember && !isOwner && (
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1 mt-1">
                <Users className="w-3 h-3" /> Team Exhibition
              </span>
            )}
          </div>
          {isOwner && (
            <Button variant="ghost" size="icon" onClick={() => setShowEdit(true)}>
              <Pencil className="w-4 h-4" />
            </Button>
          )}
        </div>

        <div className="space-y-1.5 text-sm text-gray-600">
          {exhibition.location && <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" />{exhibition.location}</p>}
          {(exhibition.from_date || exhibition.to_date) && (
            <p className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              {formatDate(exhibition.from_date)}{exhibition.to_date ? ` – ${formatDate(exhibition.to_date)}` : ""}
            </p>
          )}
          {exhibition.hotel && <p className="flex items-center gap-2"><Bed className="w-4 h-4 text-gray-400" />{exhibition.hotel}</p>}
          {exhibition.notes && <p className="flex items-center gap-2"><StickyNote className="w-4 h-4 text-gray-400" />{exhibition.notes}</p>}
        </div>

        {isOwner && exhibition.team_code && (
          <div className="mt-4">
            <TeamCodeDisplay
              code={exhibition.team_code}
              memberCount={(exhibition.team_members || []).length}
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <Button
          onClick={() => navigate(createPageUrl(`ScanCard?exhibition_id=${exhibitionId}`))}
          className="bg-blue-600 hover:bg-blue-700 gap-2"
        >
          <QrCode className="w-4 h-4" />
          Scan Card
        </Button>
        <Button
          variant="outline"
          onClick={() => navigate(createPageUrl(`AddContact?exhibition_id=${exhibitionId}`))}
          className="gap-2"
        >
          <UserPlus className="w-4 h-4" />
          Add Manually
        </Button>
        {isOwner && contacts.length > 0 && (
          <Button variant="outline" onClick={exportToCSV} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        )}
      </div>

      {/* Contacts */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-gray-900">
          Contacts <span className="text-gray-400 font-normal text-base">({contacts.length})</span>
        </h2>
      </div>

      {contacts.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <QrCode className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>No contacts yet. Start scanning!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map(contact => (
            <div key={contact.id}>
              {(isOwner || isTeamMember) && contact.created_by !== currentUser?.email && (
                <p className="text-xs text-gray-400 mb-1 ml-1">
                  Scanned by {teamMemberNames[contact.created_by] || contact.created_by}
                </p>
              )}
              <ContactCard
                contact={contact}
                onUpdate={loadData}
                defaultTags={defaultTags}
                isOwner={isOwner}
                isOwnContact={contact.created_by === currentUser?.email}
              />
            </div>
          ))}
        </div>
      )}

      {isOwner && (
        <EditExhibitionDialog
          open={showEdit}
          onOpenChange={setShowEdit}
          exhibition={exhibition}
          onSave={handleSaveExhibition}
          onDelete={handleDeleteExhibition}
        />
      )}
    </div>
  );
}