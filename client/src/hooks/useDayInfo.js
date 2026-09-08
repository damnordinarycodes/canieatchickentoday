import { useEffect, useRef, useState } from "react";
import { fetchDay } from "../api";

export function useDayInfo(dateISO, state, religion, region) {
  const [dayInfo, setDayInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const cache = useRef(new Map());

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `${dateISO}|${state || ""}|${religion || ""}|${region || ""}`;

    if (cache.current.has(cacheKey)) {
      setDayInfo(cache.current.get(cacheKey));
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchDay(dateISO, state, religion, region)
      .then((data) => {
        if (cancelled) return;
        cache.current.set(cacheKey, data);
        setDayInfo(data);
      })
      .catch(() => {
        if (!cancelled) setDayInfo(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [dateISO, state, religion, region]);

  return { dayInfo, loading };
}
