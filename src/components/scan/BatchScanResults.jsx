import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, AlertCircle, Users } from "lucide-react";

export default function BatchScanResults({ results, onDone }) {
  const saved = results.filter(r => r.status === "saved");
  const failed = results.filter(r => r.status === "failed");
  const skipped = results.filter(r => r.status === "skipped");

  return (
    <div className="min-h-screen px-4 py-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Users className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-1">Batch Scan Complete</h1>
        <p className="text-gray-500">
          {saved.length} saved · {failed.length} failed · {skipped.length} skipped
        </p>
      </div>

      <div className="space-y-3 mb-8">
        {results.map((r, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-xl border ${
              r.status === "saved"
                ? "bg-green-50 border-green-200"
                : r.status === "failed"
                ? "bg-red-50 border-red-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            {r.status === "saved" ? (
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            ) : r.status === "failed" ? (
              <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {r.name || `Card ${i + 1}`}
              </p>
              {r.company && <p className="text-xs text-gray-500 truncate">{r.company}</p>}
              {r.error && <p className="text-xs text-red-500">{r.error}</p>}
              {r.status === "skipped" && <p className="text-xs text-amber-600">Possible duplicate — skipped</p>}
            </div>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              r.status === "saved" ? "bg-green-200 text-green-800" :
              r.status === "failed" ? "bg-red-200 text-red-800" :
              "bg-amber-200 text-amber-800"
            }`}>
              {r.status}
            </span>
          </div>
        ))}
      </div>

      <Button onClick={onDone} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
        Done
      </Button>
    </div>
  );
}