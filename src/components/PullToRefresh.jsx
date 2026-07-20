import React from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { usePullToRefresh } from "@/hooks/usePullToRefresh";

export default function PullToRefresh({ children, onRefresh, disabled }) {
  const { pullDistance, refreshing, pullProgress } = usePullToRefresh(onRefresh, { disabled });

  return (
    <>
      {(pullDistance > 0 || refreshing) && (
        <div
          className="fixed top-20 left-0 right-0 flex justify-center pointer-events-none z-20 transition-opacity"
          style={{ opacity: pullProgress }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg">
            {refreshing ? (
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            ) : (
              <RefreshCw
                className="w-5 h-5 text-blue-600 transition-transform"
                style={{ transform: `rotate(${pullProgress * 360}deg)` }}
              />
            )}
          </div>
        </div>
      )}
      {children}
    </>
  );
}