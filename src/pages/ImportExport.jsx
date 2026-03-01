import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Upload, FileText, MapPin } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function ImportExport() {
  const [importType, setImportType] = useState("contacts");
  const [selectedExhibition, setSelectedExhibition] = useState("");
  const [importFile, setImportFile] = useState(null);
  const [importing, setImporting] = useState(false);
  const [exportType, setExportType] = useState("contacts");
  const [exportExhibition, setExportExhibition] = useState("");
  const [exporting, setExporting] = useState(false);

  const { data: exhibitions = [] } = useQuery({
    queryKey: ['exhibitions'],
    queryFn: () => base44.entities.Exhibition.list(),
  });

  const handleImportFile = async () => {
    if (!importFile || !selectedExhibition) return;
    
    setImporting(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: importFile });
      
      const schema = importType === "contacts" 
        ? {
            type: "object",
            properties: {
              full_name: { type: "string" },
              company: { type: "string" },
              position: { type: "string" },
              email: { type: "string" },
              phone_mobile: { type: "string" },
              phone_landline: { type: "string" },
              phone_fax: { type: "string" },
              phone_other: { type: "string" },
              country: { type: "string" },
              website: { type: "string" },
              address: { type: "string" },
              notes: { type: "string" }
            }
          }
        : {
            type: "object",
            properties: {
              name: { type: "string" },
              category: { type: "string" },
              address: { type: "string" },
              website: { type: "string" },
              notes: { type: "string" },
              rating: { type: "number" }
            }
          };

      const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: schema
      });

      if (result.status === "success" && result.output) {
        const records = Array.isArray(result.output) ? result.output : [result.output];
        const recordsWithExhibition = records.map(r => ({
          ...r,
          exhibition_id: selectedExhibition
        }));

        // Import to correct entity based on type
        if (importType === "places") {
          await base44.entities.Place.bulkCreate(recordsWithExhibition);
          alert(`Successfully imported ${records.length} places!`);
        } else if (importType === "contacts") {
          await base44.entities.Contact.bulkCreate(recordsWithExhibition);
          alert(`Successfully imported ${records.length} contacts!`);
        }
        
        setImportFile(null);
        setSelectedExhibition("");
      } else {
        alert("Failed to extract data from file: " + result.details);
      }
    } catch (err) {
      alert("Import failed: " + err.message);
    }
    setImporting(false);
  };

  const handleExport = async () => {
    if (!exportExhibition) return;
    
    setExporting(true);
    try {
      let data;
      if (exportType === "contacts") {
        data = await base44.entities.Contact.filter({ exhibition_id: exportExhibition });
      } else {
        data = await base44.entities.Place.filter({ exhibition_id: exportExhibition });
      }

      if (data.length === 0) {
        alert(`No ${exportType} found for this exhibition.`);
        setExporting(false);
        return;
      }

      const headers = exportType === "contacts"
        ? ["Full Name", "Company", "Position", "Email", "Mobile", "Landline", "Fax", "Other Phone", "Country", "Website", "Address", "Notes"]
        : ["Name", "Category", "Address", "Website", "Notes", "Rating"];

      const csvContent = [
        headers.join(","),
        ...data.map(item => {
          if (exportType === "contacts") {
            return [
              item.full_name || "",
              item.company || "",
              item.position || "",
              item.email || "",
              item.phone_mobile || "",
              item.phone_landline || "",
              item.phone_fax || "",
              item.phone_other || "",
              item.country || "",
              item.website || "",
              item.address || "",
              item.notes || ""
            ].map(field => `"${field}"`).join(",");
          } else {
            return [
              item.name || "",
              item.category || "",
              item.address || "",
              item.website || "",
              item.notes || "",
              item.rating || ""
            ].map(field => `"${field}"`).join(",");
          }
        })
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${exportType}_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Export failed: " + err.message);
    }
    setExporting(false);
  };

  const handleExportVCard = async () => {
    if (!exportExhibition) return;

    setExporting(true);
    try {
      const contacts = await base44.entities.Contact.filter({ exhibition_id: exportExhibition });

      if (contacts.length === 0) {
        alert("No contacts found for this exhibition.");
        setExporting(false);
        return;
      }

      const vcards = contacts.map(c => {
        const nameParts = (c.full_name || "").trim().split(" ");
        const firstName = nameParts.slice(0, -1).join(" ");
        const lastName = nameParts.slice(-1).join(" ");

        const lines = [
          "BEGIN:VCARD",
          "VERSION:3.0",
          `FN:${c.full_name || ""}`,
          `N:${lastName};${firstName};;;`,
        ];
        if (c.company) lines.push(`ORG:${c.company}`);
        if (c.position) lines.push(`TITLE:${c.position}`);
        if (c.email) lines.push(`EMAIL;TYPE=WORK:${c.email}`);
        if (c.phone_mobile) lines.push(`TEL;TYPE=CELL:${c.phone_mobile}`);
        if (c.phone_landline) lines.push(`TEL;TYPE=WORK:${c.phone_landline}`);
        if (c.phone_fax) lines.push(`TEL;TYPE=FAX:${c.phone_fax}`);
        if (c.website) lines.push(`URL:${c.website}`);
        if (c.address) lines.push(`ADR;TYPE=WORK:;;${c.address};;;;`);
        if (c.notes) lines.push(`NOTE:${c.notes.replace(/\n/g, "\\n")}`);
        lines.push("END:VCARD");
        return lines.join("\r\n");
      });

      const blob = new Blob([vcards.join("\r\n\r\n")], { type: "text/vcard" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contacts_${new Date().toISOString().split('T')[0]}.vcf`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("vCard export failed: " + err.message);
    }
    setExporting(false);
  };

  return (
    <div className="px-4 py-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Import & Export</h1>
      <p className="text-gray-600 mb-8">Share your contacts and places with CSV files</p>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Import Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Import Data
            </CardTitle>
            <CardDescription>Upload CSV file to import contacts or places</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Import Type</Label>
              <Select value={importType} onValueChange={setImportType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contacts">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Contacts
                    </div>
                  </SelectItem>
                  <SelectItem value="places">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Places
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Exhibition</Label>
              <Select value={selectedExhibition} onValueChange={setSelectedExhibition}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose exhibition..." />
                </SelectTrigger>
                <SelectContent>
                  {exhibitions.map(ex => (
                    <SelectItem key={ex.id} value={ex.id}>
                      {ex.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>CSV File</Label>
              <Input
                type="file"
                accept=".csv"
                onChange={(e) => setImportFile(e.target.files[0])}
                className="mt-1"
              />
            </div>

            <Button 
              onClick={handleImportFile} 
              disabled={!importFile || !selectedExhibition || importing}
              className="w-full"
            >
              {importing ? "Importing..." : `Import ${importType}`}
            </Button>
          </CardContent>
        </Card>

        {/* Export Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Export Data
            </CardTitle>
            <CardDescription>Download contacts or places as CSV file</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Export Type</Label>
              <Select value={exportType} onValueChange={setExportType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contacts">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Contacts
                    </div>
                  </SelectItem>
                  <SelectItem value="places">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Places
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Select Exhibition</Label>
              <Select value={exportExhibition} onValueChange={setExportExhibition}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose exhibition..." />
                </SelectTrigger>
                <SelectContent>
                  {exhibitions.map(ex => (
                    <SelectItem key={ex.id} value={ex.id}>
                      {ex.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              onClick={handleExport} 
              disabled={!exportExhibition || exporting}
              className="w-full"
            >
              {exporting ? "Exporting..." : `Export ${exportType} as CSV`}
            </Button>

            {exportType === "contacts" && (
              <Button
                onClick={handleExportVCard}
                disabled={!exportExhibition || exporting}
                variant="outline"
                className="w-full"
              >
                {exporting ? "Exporting..." : "Export Contacts as vCard (.vcf)"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}