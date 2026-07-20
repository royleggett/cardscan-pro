import { useEffect, useRef, useState } from "react";

export function usePullToRefresh(onRefresh, { threshold = 70, disabled = false } = {}) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);
  const refreshingRef = useRef(false);
  const pullDistanceRef = useRef(0);
  const onRefreshRef = useRef(onRefresh);

  useEffect(() => {
    onRefreshRef.current = onRefresh;
  }, [onRefresh]);

  useEffect(() => {
    if (disabled) return;

    const handleTouchStart = (e) => {
      const target = e.target;
      if (target.closest?.("[role='dialog']") || target.closest?.("[data-vaul-drawer]")) return;
      if (window.scrollY <= 0 && !refreshingRef.current) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      }
    };

    const handleTouchMove = (e) => {
      if (!pulling.current || refreshingRef.current) return;
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;
      if (diff > 0) {
        const newDistance = Math.min(diff * 0.5, threshold * 1.5);
        pullDistanceRef.current = newDistance;
        setPullDistance(newDistance);
      }
    };

    const handleTouchEnd = async () => {
      if (!pulling.current) return;
      pulling.current = false;
      if (pullDistanceRef.current >= threshold) {
        setRefreshing(true);
        refreshingRef.current = true;
        setPullDistance(threshold);
        try {
          await onRefreshRef.current();
        } finally {
          setRefreshing(false);
          refreshingRef.current = false;
          setPullDistance(0);
          pullDistanceRef.current = 0;
        }
      } else {
        setPullDistance(0);
        pullDistanceRef.current = 0;
      }
    };

    document.addEventListener("touchstart", handleTouchStart, { passive: true });
    document.addEventListener("touchmove", handleTouchMove, { passive: true });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [disabled, threshold]);

  return {
    pullDistance,
    refreshing,
    pullProgress: Math.min(pullDistance / threshold, 1),
  };
}