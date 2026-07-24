import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

export default function FollowUpResponse() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  const contactId = searchParams.get("contact_id");
  const action = searchParams.get("action");

  useEffect(() => {
    const handleResponse = async () => {
      if (!contactId) {
        setStatus("error");
        return;
      }

      try {
        // Always use the backend function (works with or without login)
        const res = await base44.functions.invoke("updateFollowUpStatus", {
          contact_id: contactId,
          action
        });
        if (res?.data?.success) {
          setStatus(action === "yes" ? "success" : "no-action");
        } else {
          setStatus("error");
        }
      } catch (err) {
        // Fallback: try direct update if function fails (works if logged in)
        try {
          if (action === "yes") {
            await base44.entities.Contact.update(contactId, { follow_up_contacted: true });
          }
          setStatus(action === "yes" ? "success" : "no-action");
        } catch (err2) {
          setStatus("error");
        }
      }
    };
    handleResponse();
  }, [contactId, action]);

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <p className="text-gray-500">Updating...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <XCircle className="w-12 h-12 text-red-500" />
        <p className="text-gray-700 font-medium">Something went wrong. We couldn't update this contact.</p>
        <Button onClick={() => navigate(createPageUrl("Home"))}>Go to Home</Button>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
        <CheckCircle2 className="w-12 h-12 text-green-500" />
        <h2 className="text-xl font-bold">Marked as Contacted!</h2>
        <p className="text-gray-500">Great work following up on this lead.</p>
        <Button onClick={() => navigate(createPageUrl("AllContacts"))}>View Contacts</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
      <XCircle className="w-12 h-12 text-gray-400" />
      <h2 className="text-xl font-bold">No problem!</h2>
      <p className="text-gray-500">We'll leave this lead as-is for now.</p>
      <Button onClick={() => navigate(createPageUrl("Home"))}>Go to Home</Button>
    </div>
  );
}