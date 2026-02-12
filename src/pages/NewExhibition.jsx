import React, { useState } from "react";
import { Exhibition } from "@/entities/Exhibition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function NewExhibition() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await Exhibition.create({ name, location });
    navigate(createPageUrl("Exhibitions"));
  };

  return (
    <div className="px-4 py-6 max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>New Exhibition</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Exhibition Name *</Label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Tech Expo 2024"
              />
            </div>

            <div>
              <Label>Location</Label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., Dubai"
              />
            </div>

            <Button type="submit" className="w-full">
              Create Exhibition
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}