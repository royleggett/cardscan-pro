import React, { useState, useRef } from "react";
import { Contact } from "@/entities/Contact";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Camera, Upload, Loader2, Edit, AlertCircle, QrCode, FlipHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

import CameraCapture from "../components/scan/CameraCapture";
import ContactPreview from "../components/scan/ContactPreview";
import QRScanner from "../components/scan/QRScanner";

export default function ScanCard() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const exhibitionId = urlParams.get("exhibition_id");
  
  const [showCamera, setShowCamera] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scanningDoubleSided, setScanningDoubleSided] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [cardImageUrl, setCardImageUrl] = useState(null);
  const [cardImageBackUrl, setCardImageBackUrl] = useState(null);
  const [firstSideData, setFirstSideData] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const fileInputRef = useRef(null);

  const compressImage = async (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          const maxDimension = 1920;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            });
            console.log(`Compressed from ${(file.size / 1024 / 1024).toFixed(2)}MB to ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`);
            resolve(compressedFile);
          }, 'image/jpeg', 0.85);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadWithRetry = async (file, maxRetries = 3) => {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setStatusMessage(`Uploading image (attempt ${attempt}/${maxRetries})...`);
        const result = await base44.integrations.Core.UploadFile({ file });
        return result;
      } catch (err) {
        console.error(`Upload attempt ${attempt} failed:`, err);
        if (attempt === maxRetries) {
          throw err;
        }
        setStatusMessage(`Upload failed, retrying in ${attempt * 2} seconds...`);
        await new Promise(resolve => setTimeout(resolve, attempt * 2000));
      }
    }
  };

  const processImage = async (file, isSecondSide = false) => {
    setProcessing(true);
    setError(null);
    setStatusMessage(isSecondSide ? "Processing back side..." : "Compressing image...");
    
    try {
      console.log("Compressing image...");
      const compressedFile = await compressImage(file);
      
      console.log("Uploading file with retry logic...");
      const { file_url } = await uploadWithRetry(compressedFile);
      console.log("File uploaded:", file_url);
      
      if (isSecondSide) {
        setCardImageBackUrl(file_url);
      } else {
        setCardImageUrl(file_url);
      }

      setStatusMessage("Extracting data from business card...");
      console.log("Extracting data from file...");
      const result = await base44.integrations.Core.ExtractDataFromUploadedFile({
        file_url,
        json_schema: {
          type: "object",
          properties: {
            full_name: { type: "string" },
            company: { type: "string" },
            position: { type: "string" },
            email: { type: "string" },
            phone_numbers: { type: "array", items: { type: "string" }},
            website: { type: "string" },
            address: { type: "string" }
          }
        }
      });
      console.log("Extraction result:", result);

      let phoneData = {
        phone_mobile: "",
        phone_landline: "",
        phone_fax: "",
        phone_other: ""
      };

      if (result.status === "success" && result.output) {
        if (result.output.phone_numbers && result.output.phone_numbers.length > 0) {
          setStatusMessage("Categorizing phone numbers...");
          console.log("Categorizing phone numbers...");
          const phonePrompt = `Categorize these phone numbers: ${JSON.stringify(result.output.phone_numbers)}

Return ONLY a JSON object:
{
  "phone_mobile": "mobile number if found",
  "phone_landline": "landline number if found", 
  "phone_fax": "fax number if found",
  "phone_other": "other number if found"
}`;

          const categorizedPhones = await base44.integrations.Core.InvokeLLM({
            prompt: phonePrompt,
            response_json_schema: {
              type: "object",
              properties: {
                phone_mobile: { type: "string" },
                phone_landline: { type: "string" },
                phone_fax: { type: "string" },
                phone_other: { type: "string" }
              }
            }
          });
          phoneData = categorizedPhones;
          console.log("Phone data:", phoneData);
        }

        let country = "";
        if (result.output.address || phoneData.phone_mobile) {
          setStatusMessage("Detecting country...");
          console.log("Detecting country...");
          const countryPrompt = `Based on this info, identify the country. Return only the country name:

Address: ${result.output.address || "N/A"}
Phone: ${phoneData.phone_mobile || phoneData.phone_landline || "N/A"}`;

          country = await base44.integrations.Core.InvokeLLM({ prompt: countryPrompt });
          console.log("Country:", country);
        }
        
        const currentData = {
          full_name: result.output.full_name || "",
          company: result.output.company || "",
          position: result.output.position || "",
          email: result.output.email || "",
          ...phoneData,
          website: result.output.website || "",
          address: result.output.address || "",
          country: country.trim(),
          notes: ""
        };

        if (isSecondSide && firstSideData) {
          // Combine data from both sides
          setExtractedData({
            full_name: currentData.full_name || firstSideData.full_name,
            company: currentData.company || firstSideData.company,
            position: currentData.position || firstSideData.position,
            email: currentData.email || firstSideData.email,
            phone_mobile: currentData.phone_mobile || firstSideData.phone_mobile,
            phone_landline: currentData.phone_landline || firstSideData.phone_landline,
            phone_fax: currentData.phone_fax || firstSideData.phone_fax,
            phone_other: currentData.phone_other || firstSideData.phone_other,
            website: currentData.website || firstSideData.website,
            address: currentData.address || firstSideData.address,
            country: currentData.country || firstSideData.country,
            notes: "",
            card_image_url: firstSideData.card_image_url,
            card_image_back_url: file_url
          });
          setFirstSideData(null);
          setScanningDoubleSided(false);
        } else if (scanningDoubleSided) {
          // Save first side data and prompt for second side
          setFirstSideData({ ...currentData, card_image_url: file_url });
          setProcessing(false);
          setStatusMessage("");
          setShowCamera(true);
          return;
        } else {
          setExtractedData({
            ...currentData,
            card_image_url: file_url
          });
        }
      } else {
        console.log("Extraction failed, using empty data");
        const emptyData = {
          full_name: "",
          company: "",
          position: "",
          email: "",
          phone_mobile: "",
          phone_landline: "",
          phone_fax: "",
          phone_other: "",
          website: "",
          address: "",
          country: "",
          notes: ""
        };

        if (isSecondSide && firstSideData) {
          setExtractedData({
            ...firstSideData,
            card_image_back_url: file_url
          });
          setFirstSideData(null);
          setScanningDoubleSided(false);
        } else if (scanningDoubleSided) {
          setFirstSideData({ ...emptyData, card_image_url: file_url });
          setProcessing(false);
          setStatusMessage("");
          setShowCamera(true);
          return;
        } else {
          setExtractedData({
            ...emptyData,
            card_image_url: file_url
          });
        }
      }
      
      setProcessing(false);
      setStatusMessage("");
      setShowCamera(false);
    } catch (err) {
      console.error("Error processing image:", err);
      const errorMsg = err.message || 'Unknown error';
      if (errorMsg.includes('DatabaseTimeout') || errorMsg.includes('timeout')) {
        setError("The server is experiencing delays. Please wait a moment and try again, or use Manual Entry to save the contact now and add the card image later.");
      } else {
        setError(`Failed to process card: ${errorMsg}`);
      }
      setProcessing(false);
      setStatusMessage("");
      setShowCamera(false);
    }
  };

  const handleManualEntry = () => {
    setExtractedData({
      full_name: "",
      company: "",
      position: "",
      email: "",
      phone_mobile: "",
      phone_landline: "",
      phone_fax: "",
      phone_other: "",
      website: "",
      address: "",
      country: "",
      notes: ""
    });
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const isSecondSide = scanningDoubleSided && firstSideData !== null;
      processImage(file, isSecondSide);
    }
  };

  const handleQRScan = async (data) => {
    console.log("QR Code scanned:", data);
    setShowQRScanner(false);
    setProcessing(true);
    setStatusMessage("Processing QR code data...");
    
    try {
      let extractedInfo = {
        full_name: "",
        company: "",
        position: "",
        email: "",
        phone_mobile: "",
        phone_landline: "",
        website: "",
        address: "",
        country: "",
        phone_fax: "",
        phone_other: "",
        notes: ""
      };

      // Check if it's a vCard (BEGIN:VCARD)
      if (data.includes("BEGIN:VCARD") || data.includes("BEGIN:vCard")) {
        const lines = data.split('\n');
        for (const line of lines) {
          if (line.startsWith('FN:')) extractedInfo.full_name = line.substring(3).trim();
          if (line.startsWith('ORG:')) extractedInfo.company = line.substring(4).trim();
          if (line.startsWith('TITLE:')) extractedInfo.position = line.substring(6).trim();
          if (line.startsWith('EMAIL')) extractedInfo.email = line.split(':')[1]?.trim() || "";
          if (line.startsWith('TEL')) {
            const phone = line.split(':')[1]?.trim() || "";
            if (line.includes('CELL') || line.includes('MOBILE')) {
              extractedInfo.phone_mobile = phone;
            } else if (line.includes('FAX')) {
              extractedInfo.phone_fax = phone;
            } else if (!extractedInfo.phone_mobile) {
              extractedInfo.phone_mobile = phone;
            } else {
              extractedInfo.phone_landline = phone;
            }
          }
          if (line.startsWith('URL:')) extractedInfo.website = line.substring(4).trim();
          if (line.startsWith('ADR')) extractedInfo.address = line.split(':')[1]?.replace(/;/g, ' ').trim() || "";
        }
        setExtractedData(extractedInfo);
      } else {
        // Use LLM to intelligently extract from any format (URLs, LinkedIn, etc.)
        const prompt = `You are extracting contact information from a QR code. The QR code contains: "${data}"

This could be a LinkedIn URL, website URL, plain text, or any other format. Extract whatever contact information you can find or infer.

If it's a URL (like LinkedIn, company website, etc.), extract:
- The person's full name if visible in the URL or if you need to indicate it's from their profile
- Note the URL type in the website field
- Leave other fields empty unless the URL contains obvious contact info

Return ONLY this JSON object (use empty string "" for fields you cannot determine):
{
  "full_name": "",
  "company": "",
  "position": "",
  "email": "",
  "phone_mobile": "",
  "phone_landline": "",
  "website": "",
  "address": "",
  "country": "",
  "notes": ""
}

For LinkedIn URLs, put the LinkedIn URL in the website field and try to extract the person's name from the URL if present.`;

        const result = await base44.integrations.Core.InvokeLLM({
          prompt,
          add_context_from_internet: true,
          response_json_schema: {
            type: "object",
            properties: {
              full_name: { type: "string" },
              company: { type: "string" },
              position: { type: "string" },
              email: { type: "string" },
              phone_mobile: { type: "string" },
              phone_landline: { type: "string" },
              website: { type: "string" },
              address: { type: "string" },
              country: { type: "string" },
              notes: { type: "string" }
            }
          }
        });

        setExtractedData({
          ...result,
          phone_fax: "",
          phone_other: ""
        });
      }
      
      setProcessing(false);
      setStatusMessage("");
    } catch (err) {
      console.error("Error processing QR code:", err);
      setError(`Failed to process QR code: ${err.message || 'Unknown error'}`);
      setProcessing(false);
      setStatusMessage("");
    }
  };

  const handleDoubleSidedScan = () => {
    setScanningDoubleSided(true);
    setShowCamera(true);
  };

  const handleSave = async (contactData) => {
    await Contact.create({
      exhibition_id: exhibitionId,
      ...contactData
    });
    
    navigate(createPageUrl(`ExhibitionDetail?id=${exhibitionId}`));
  };

  const handleCancel = () => {
    if (extractedData) {
      setExtractedData(null);
      setCardImageUrl(null);
      setCardImageBackUrl(null);
      setFirstSideData(null);
      setScanningDoubleSided(false);
    } else {
      navigate(createPageUrl(`ExhibitionDetail?id=${exhibitionId}`));
    }
  };

  if (processing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <Loader2 className="w-16 h-16 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">{statusMessage || "Processing card..."}</p>
        <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
        {scanningDoubleSided && firstSideData && (
          <p className="text-sm text-blue-600 mt-2 font-semibold">Processing back side...</p>
        )}
      </div>
    );
  }

  if (extractedData) {
    return (
      <ContactPreview
        data={extractedData}
        imageUrl={cardImageUrl}
        imageBackUrl={cardImageBackUrl}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    );
  }

  if (showCamera) {
    const isSecondSide = scanningDoubleSided && firstSideData !== null;
    return (
      <div>
        {isSecondSide && (
          <div className="absolute top-4 left-0 right-0 z-50 text-center">
            <div className="bg-blue-600 text-white px-4 py-3 rounded-lg mx-4 shadow-lg">
              <p className="font-semibold">Now scan the BACK side of the card</p>
            </div>
          </div>
        )}
        <CameraCapture
          onCapture={(file) => processImage(file, isSecondSide)}
          onClose={() => {
            setShowCamera(false);
            if (scanningDoubleSided) {
              setScanningDoubleSided(false);
              setFirstSideData(null);
            }
          }}
        />
      </div>
    );
  }

  if (showQRScanner) {
    return (
      <QRScanner
        onScan={handleQRScan}
        onClose={() => setShowQRScanner(false)}
      />
    );
  }

  return (
    <div className="min-h-screen px-4 py-6">
      <Button
        variant="ghost"
        onClick={() => navigate(createPageUrl(`ExhibitionDetail?id=${exhibitionId}`))}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back
      </Button>

      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Scan Business Card</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setError(null)}
                className="ml-4"
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <button
            onClick={() => setShowCamera(true)}
            className="w-full p-8 rounded-2xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Camera className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Scan Single Side</h3>
              <p className="text-sm text-gray-500">Take a photo of the card</p>
            </div>
          </button>

          <button
            onClick={handleDoubleSidedScan}
            className="w-full p-8 rounded-2xl border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <FlipHorizontal className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Scan Both Sides</h3>
              <p className="text-sm text-gray-500">For double-sided cards</p>
            </div>
          </button>

          <button
            onClick={() => setShowQRScanner(true)}
            className="w-full p-8 rounded-2xl border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50 transition-all"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                <QrCode className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Scan QR Code</h3>
              <p className="text-sm text-gray-500">For QR-based cards</p>
            </div>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-8 rounded-2xl border-2 border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <Upload className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Upload Image</h3>
              <p className="text-sm text-gray-500">Choose from library</p>
            </div>
          </button>

          <button
            onClick={handleManualEntry}
            className="w-full p-8 rounded-2xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all"
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Edit className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Manual Entry</h3>
              <p className="text-sm text-gray-500">Type details manually</p>
            </div>
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}