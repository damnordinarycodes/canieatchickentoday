import { useEffect, useState } from "react";
import { fetchMonth } from "../api";

export function useMonthDays(year, month, state, religion) {
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchMonth(year, month, state, religion)
      .then((data) => {
        if (!cancelled) setDays(data);
      })
      .catch(() => {
        if (!cancelled) setDays([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [year, month, state, religion]);

  return { days, loading };
}
