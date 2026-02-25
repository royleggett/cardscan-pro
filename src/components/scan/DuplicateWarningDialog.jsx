import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AlertTriangle, FolderOpen } from "lucide-react";

export default function DuplicateWarningDialog({ open, duplicate, exhibitionName, onContinue, onCancel }) {
  return (
    <AlertDialog open={open} onOpenChange={(v) => { if (!v) onCancel(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            Possible Duplicate
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-3">
              <p>
                A contact named <strong>{duplicate?.full_name}</strong> already exists
                {duplicate?.email ? <> with email <strong>{duplicate.email}</strong></> : ""}.
              </p>
              {exhibitionName && (
                <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-sm text-amber-800">
                  <FolderOpen className="w-4 h-4 shrink-0" />
                  <span>First scanned at: <strong>{exhibitionName}</strong></span>
                </div>
              )}
              <p className="text-sm">Do you still want to save this contact?</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onContinue}
            className="bg-amber-600 hover:bg-amber-700"
          >
            Save Anyway
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}