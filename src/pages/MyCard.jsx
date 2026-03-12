import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Edit2, Save, Share2, Mail, Phone, Globe, MapPin, Building2, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { QRCodeSVG } from 'qrcode.react';

export default function MyCard() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // User data
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = await base44.auth.me();
    setFullName(user?.full_name || "");
    setEmail(user?.email || "");
    setBusinessEmail(user?.business_email || "");
    setCompany(user?.company || "");
    setPosition(user?.position || "");
    setPhone(user?.phone || "");
    setWebsite(user?.website || "");
    setAddress(user?.address || "");
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await base44.auth.updateMe({
      business_email: businessEmail,
      company,
      position,
      phone,
      website,
      address
    });
    setSaving(false);
    setEditing(false);
  };

  const generateVCard = () => {
    const vcard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${fullName}`,
      `EMAIL:${businessEmail || email}`,
      company ? `ORG:${company}` : "",
      position ? `TITLE:${position}` : "",
      phone ? `TEL:${phone}` : "",
      website ? `URL:${website}` : "",
      address ? `ADR:;;${address}` : "",
      "END:VCARD"
    ].filter(Boolean).join("\n");
    return vcard;
  };

  const handleShare = async () => {
    const vcard = generateVCard();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${fullName} - Contact Card`,
          text: vcard
        });
      } catch (err) {
        console.log("Share cancelled or failed:", err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(vcard);
      alert("Contact details copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  if (editing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => setEditing(false)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Contact Details</h1>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input value={fullName} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-500 mt-1">Your name cannot be changed</p>
              </div>

              <div>
                <Label>Account Email</Label>
                <Input value={email} disabled className="bg-gray-50" />
                <p className="text-xs text-gray-500 mt-1">Your login email cannot be changed</p>
              </div>

              <div>
                <Label>Business Email</Label>
                <Input
                  value={businessEmail}
                  onChange={e => setBusinessEmail(e.target.value)}
                  placeholder="e.g. john@company.com"
                  type="email"
                />
                <p className="text-xs text-gray-500 mt-1">This email will appear on your QR code</p>
              </div>

              <div>
                <Label>Company</Label>
                <Input
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div>
                <Label>Position</Label>
                <Input
                  value={position}
                  onChange={e => setPosition(e.target.value)}
                  placeholder="e.g. Sales Manager"
                />
              </div>

              <div>
                <Label>Phone</Label>
                <Input
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="e.g. +44 7700 900000"
                />
              </div>

              <div>
                <Label>Website</Label>
                <Input
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="e.g. https://mycompany.com"
                />
              </div>

              <div>
                <Label>Address</Label>
                <Input
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  placeholder="e.g. 123 Main St, London"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {saving ? "Saving..." : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const hasContactInfo = company || position || phone || website || address;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl("Home"))}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          
          <Button
            variant="outline"
            onClick={() => setEditing(true)}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Details
          </Button>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Digital Card</h1>

        {!hasContactInfo ? (
          <Card className="text-center p-8">
            <CardContent>
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Complete your profile</h3>
              <p className="text-gray-600 mb-4">
                Add your contact details to generate a shareable QR code
              </p>
              <Button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                <Edit2 className="w-4 h-4 mr-2" />
                Add Details
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Digital Business Card */}
            <Card className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white overflow-hidden">
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center mb-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-4">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{fullName}</h2>
                  {position && <p className="text-blue-100 text-lg">{position}</p>}
                  {company && <p className="text-blue-200 font-semibold">{company}</p>}
                </div>

                <div className="space-y-3 text-sm">
                  {(businessEmail || email) && (
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 flex-shrink-0 text-blue-200" />
                      <span className="break-all">{businessEmail || email}</span>
                    </div>
                  )}
                  {phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 flex-shrink-0 text-blue-200" />
                      <span>{phone}</span>
                    </div>
                  )}
                  {website && (
                    <div className="flex items-center gap-3">
                      <Globe className="w-4 h-4 flex-shrink-0 text-blue-200" />
                      <span className="break-all">{website}</span>
                    </div>
                  )}
                  {address && (
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 flex-shrink-0 text-blue-200" />
                      <span>{address}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* QR Code Card */}
            <Card>
              <CardContent className="p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan to Save Contact</h3>
                <div className="bg-white p-6 rounded-xl inline-block shadow-sm border-2 border-gray-100">
                  <QRCodeSVG
                    value={generateVCard()}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <p className="text-sm text-gray-500 mt-4 mb-6">
                  Others can scan this QR code to save your contact details
                </p>
                <Button
                  onClick={handleShare}
                  className="bg-blue-600 hover:bg-blue-700 w-full"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Contact
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}