import { useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { processPlaceQueue, getPendingPlaces } from "@/lib/placeSyncQueue";

/**
 * Runs app-wide: uploads places saved while offline as soon as
 * the device reconnects (or on app launch with pending items).
 */
export default function PlaceSyncManager() {
  const { toast } = useToast();

  useEffect(() => {
    const sync = async () => {
      if (getPendingPlaces().length === 0) return;
      try {
        const { synced } = await processPlaceQueue();
        if (synced > 0) {
          toast({
            title: "Offline places synced",
            description: `${synced} place${synced === 1 ? "" : "s"} saved on your device ${synced === 1 ? "was" : "were"} uploaded successfully.`
          });
        }
      } catch (err) {
        console.error("Place sync error:", err);
      }
    };

    sync();
    window.addEventListener("online", sync);
    return () => window.removeEventListener("online", sync);
  }, [toast]);

  return null;
}