import React, { useState, useRef } from "react";
import { Contact } from "@/entities/Contact";
import { Exhibition } from "@/entities/Exhibition";
import { UploadFile, ExtractDataFromUploadedFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, FileSpreadsheet, CheckCircle2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ImportContacts() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [parsedData, setParsedData] = useState(null);
  const [existingExhibitions, setExistingExhibitions] = useState([]);
  const [exhibitionMappings, setExhibitionMappings] = useState({});

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError("Please upload a CSV file only. If you have an Excel file (.xlsx), open it and save as CSV first.");
      return;
    }

    setUploading(true);
    setError(null);
    setResult(null);
    setParsedData(null);

    try {
      const { file_url } = await UploadFile({ file });

      const extractResult = await ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "array",
          items: {
            type: "object",
            properties: {
              exhibition_name: { type: "string" },
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
        }
      });

      if (extractResult.status === "success" && extractResult.output) {
        const contacts = extractResult.output;
        
        const exhibitions = await Exhibition.list();
        setExistingExhibitions(exhibitions);

        const uniqueExhibitionNames = [...new Set(contacts.map(c => c.exhibition_name).filter(Boolean))];
        
        const mappings = {};
        uniqueExhibitionNames.forEach(exName => {
          const existing = exhibitions.find(ex => ex.name === exName);
          mappings[exName] = {
            action: existing ? 'existing' : 'new',
            existingId: existing?.id || null,
            newName: exName
          };
        });

        setExhibitionMappings(mappings);
        setParsedData(contacts);
      } else {
        setError("Failed to parse CSV file. Please make sure it's in the correct format.");
      }
    } catch (err) {
      console.error("Import error:", err);
      setError("Failed to import contacts. Please check the file format and try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleImport = async () => {
    setProcessing(true);
    setError(null);

    try {
      const currentUser = await base44.auth.me();
      const exhibitionMap = {};

      for (const [csvExName, mapping] of Object.entries(exhibitionMappings)) {
        if (mapping.action === 'existing') {
          const exList = await Exhibition.filter({ id: mapping.existingId });
          exhibitionMap[csvExName] = { id: mapping.existingId, team_members: exList[0]?.team_members || [] };
        } else if (mapping.action === 'new') {
          const newEx = await Exhibition.create({ name: mapping.newName, team_members: [currentUser?.email] });
          exhibitionMap[csvExName] = { id: newEx.id, team_members: [currentUser?.email] };
        }
      }

      let imported = 0;
      let failed = 0;
      const errors = [];

      for (let i = 0; i < parsedData.length; i++) {
        const contact = parsedData[i];
        const exInfo = exhibitionMap[contact.exhibition_name];
        const exhibition_id = exInfo?.id;
        const team_members = exInfo?.team_members || [];
        
        if (!exhibition_id) {
          failed++;
          errors.push(`Row ${i + 1}: No exhibition mapped for "${contact.exhibition_name}"`);
          continue;
        }

        if (!contact.full_name || contact.full_name.trim() === '') {
          failed++;
          errors.push(`Row ${i + 1}: Missing full name (required field)`);
          continue;
        }

        try {
          await Contact.create({
            exhibition_id,
            full_name: contact.full_name || "",
            company: contact.company || "",
            position: contact.position || "",
            email: contact.email || "",
            phone_mobile: contact.phone_mobile || "",
            phone_landline: contact.phone_landline || "",
            phone_fax: contact.phone_fax || "",
            phone_other: contact.phone_other || "",
            country: contact.country || "",
            website: contact.website || "",
            address: contact.address || "",
            notes: contact.notes || "",
            team_members
          });
          imported++;
        } catch (err) {
          failed++;
          errors.push(`Row ${i + 1} (${contact.full_name || 'Unknown'}): ${err.message || 'Failed to create'}`);
        }
      }

      const newExhibitionsCount = Object.values(exhibitionMappings).filter(m => m.action === 'new').length;

      setResult({
        success: true,
        imported,
        failed,
        exhibitions: newExhibitionsCount,
        errors: errors.length > 0 ? errors : null
      });
      setParsedData(null);
    } catch (err) {
      console.error("Import error:", err);
      setError("Failed to import contacts. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="px-4 py-6 max-w-3xl mx-auto">
      <Button
        variant="ghost"
        onClick={() => navigate(createPageUrl("Home"))}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600" />
            Import Contacts from CSV
          </CardTitle>
          <p className="text-sm text-gray-500">
            Upload your exported CSV file to restore your contacts
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {!parsedData && (
            <>
              <div className="bg-amber-50 border border-amber-300 rounded-lg p-4">
                <h3 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Important: CSV Files Only
                </h3>
                <p className="text-sm text-amber-800 mb-2">
                  This import only accepts <strong>.csv</strong> files.
                </p>
                <p className="text-sm text-amber-700">
                  If you have an Excel file (.xlsx), open it in Excel and save as CSV format first.
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">CSV Format Required:</h3>
                <p className="text-sm text-blue-800 mb-2">
                  Your CSV should have these columns:
                </p>
                <ul className="text-xs text-blue-700 space-y-1 ml-4">
                  <li>• Exhibition (exhibition name)</li>
                  <li>• Name (full name)</li>
                  <li>• Company</li>
                  <li>• Position</li>
                  <li>• Email</li>
                  <li>• Mobile</li>
                  <li>• Landline</li>
                  <li>• Fax</li>
                  <li>• Other Phone</li>
                  <li>• Country/Area</li>
                  <li>• Website</li>
                  <li>• Address</li>
                  <li>• Notes</li>
                </ul>
              </div>
            </>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {result && result.success && (
            <>
              <Alert className={result.failed > 0 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}>
                {result.failed > 0 ? (
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
                <AlertDescription className={result.failed > 0 ? "text-amber-800" : "text-green-800"}>
                  Successfully imported {result.imported} contact{result.imported !== 1 ? 's' : ''} across {result.exhibitions} exhibition{result.exhibitions !== 1 ? 's' : ''}!
                  {result.failed > 0 && (
                    <span className="block mt-1">
                      {result.failed} contact{result.failed !== 1 ? 's' : ''} failed to import.
                    </span>
                  )}
                </AlertDescription>
              </Alert>
              
              {result.errors && result.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">Import Errors:</h4>
                  <ul className="text-sm text-red-700 space-y-1">
                    {result.errors.map((err, idx) => (
                      <li key={idx}>• {err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}

          {!parsedData && !result && (
            <div className="space-y-4">
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full h-32 bg-blue-600 hover:bg-blue-700 flex flex-col gap-3"
              >
                {uploading ? (
                  <>
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing CSV...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-12 h-12" />
                    <span>Click to Upload CSV File</span>
                  </>
                )}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}

          {parsedData && (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Found {parsedData.length} contacts to import
                </h3>
                <p className="text-sm text-blue-700">
                  Review the exhibitions below and choose where to import them
                </p>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Exhibition Mappings:</h4>
                {Object.entries(exhibitionMappings).map(([csvExName, mapping]) => (
                  <Card key={csvExName} className="bg-gray-50">
                    <CardContent className="p-4 space-y-3">
                      <div>
                        <Label className="text-sm text-gray-600">From CSV:</Label>
                        <p className="font-medium">{csvExName}</p>
                      </div>

                      <div>
                        <Label htmlFor={`action-${csvExName}`}>Import to:</Label>
                        <Select
                          value={mapping.action}
                          onValueChange={(value) => {
                            setExhibitionMappings(prev => ({
                              ...prev,
                              [csvExName]: {
                                ...prev[csvExName],
                                action: value
                              }
                            }));
                          }}
                        >
                          <SelectTrigger id={`action-${csvExName}`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">Create New Exhibition</SelectItem>
                            {existingExhibitions.length > 0 && (
                              <SelectItem value="existing">Use Existing Exhibition</SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      {mapping.action === 'new' && (
                        <div>
                          <Label htmlFor={`name-${csvExName}`}>New Exhibition Name:</Label>
                          <Input
                            id={`name-${csvExName}`}
                            value={mapping.newName}
                            onChange={(e) => {
                              setExhibitionMappings(prev => ({
                                ...prev,
                                [csvExName]: {
                                  ...prev[csvExName],
                                  newName: e.target.value
                                }
                              }));
                            }}
                            placeholder="Enter exhibition name"
                          />
                        </div>
                      )}

                      {mapping.action === 'existing' && (
                        <div>
                          <Label htmlFor={`existing-${csvExName}`}>Select Existing Exhibition:</Label>
                          <Select
                            value={mapping.existingId || ""}
                            onValueChange={(value) => {
                              setExhibitionMappings(prev => ({
                                ...prev,
                                [csvExName]: {
                                  ...prev[csvExName],
                                  existingId: value
                                }
                              }));
                            }}
                          >
                            <SelectTrigger id={`existing-${csvExName}`}>
                              <SelectValue placeholder="Choose exhibition" />
                            </SelectTrigger>
                            <SelectContent>
                              {existingExhibitions.map(ex => (
                                <SelectItem key={ex.id} value={ex.id}>{ex.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      )}

                      <p className="text-xs text-gray-600">
                        {parsedData.filter(c => c.exhibition_name === csvExName).length} contact(s) will be imported here
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setParsedData(null);
                    setExhibitionMappings({});
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleImport}
                  disabled={processing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Import {parsedData.length} Contacts
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {result && result.success && (
            <Button
              onClick={() => navigate(createPageUrl("Exhibitions"))}
              className="w-full"
              variant="outline"
            >
              View Exhibitions
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}