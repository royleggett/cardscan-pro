import React, { useState, useEffect } from "react";
import { BusinessCard } from "@/entities/BusinessCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Edit2, Save, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { UploadFile } from "@/integrations/Core";

export default function MyCard() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(true);
  const [cardImageUrl, setCardImageUrl] = useState("");
  const [cardId, setCardId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCard();
  }, []);

  const loadCard = async () => {
    const cards = await BusinessCard.list();
    if (cards.length > 0) {
      setCardImageUrl(cards[0].card_image_url);
      setCardId(cards[0].id);
      setEditing(false);
    }
    setLoading(false);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const { file_url } = await UploadFile({ file });
    setCardImageUrl(file_url);
    setUploading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    
    try {
      if (cardId) {
        await BusinessCard.update(cardId, { card_image_url: cardImageUrl });
      } else {
        const newCard = await BusinessCard.create({ card_image_url: cardImageUrl });
        setCardId(newCard.id);
      }
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate(createPageUrl("Home"))}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        {!editing && cardImageUrl && (
          <Button
            variant="outline"
            onClick={() => setEditing(true)}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Change Card
          </Button>
        )}
      </div>

      {editing ? (
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 space-y-4">
            <h2 className="text-xl font-bold mb-4">
              {cardImageUrl ? "Update Business Card" : "Add Your Business Card"}
            </h2>
            
            {cardImageUrl && (
              <div className="mb-6">
                <p className="text-sm text-gray-500 mb-2">Current Card:</p>
                <img
                  src={cardImageUrl}
                  alt="Business card"
                  className="w-full rounded-lg border"
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="card_upload">
                {cardImageUrl ? "Upload New Business Card Image" : "Upload Business Card Image"}
              </Label>
              <Input
                id="card_upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
            </div>

            <div className="flex gap-3 pt-4">
              {cardImageUrl && (
                <Button
                  variant="outline"
                  onClick={() => setEditing(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
              <Button
                onClick={handleSave}
                disabled={saving || uploading || !cardImageUrl}
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
      ) : (
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Business Card</h1>
          
          {cardImageUrl ? (
            <>
              <Card className="overflow-hidden shadow-xl">
                <CardContent className="p-0">
                  <img
                    src={cardImageUrl}
                    alt="Business card"
                    className="w-full"
                  />
                </CardContent>
              </Card>
              <p className="text-sm text-gray-500 text-center mt-4">
                Your business card
              </p>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-4">No business card uploaded yet</p>
              <Button onClick={() => setEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                <Upload className="w-4 h-4 mr-2" />
                Upload Card
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}