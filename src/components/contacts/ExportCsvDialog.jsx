import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/**
 * Reusable CSV export dialog. Mirrors the export flow used on AllContacts.
 *
 * Props:
 *   contacts  – array of contact objects to export
 *   open      – boolean controlling dialog visibility
 *   onOpenChange – setter for open
 *   defaultFileName – default file name (no extension)
 */
export default function ExportCsvDialog({ contacts, open, onOpenChange, defaultFileName = "contacts", exhibitionMap = null }) {
  const [fileName, setFileName] = useState(defaultFileName);

  useEffect(() => {
    if (open) setFileName(defaultFileName);
  }, [open, defaultFileName]);

  const exportToCsv = () => {
    const exportData = contacts.map(contact => ({
      ...(exhibitionMap ? { 'Exhibition': exhibitionMap[contact.exhibition_id] || '' } : {}),
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

    const headers = Object.keys(exportData[0] || { Name: '' });
    const csvContent = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => {
        const value = String(row[header] ?? '').replace(/"/g, '""');
        return `"${value}"`;
      }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName || defaultFileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={exportToCsv} className="bg-blue-600 hover:bg-blue-700 transition-all duration-150 active:scale-95 active:bg-blue-800">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}