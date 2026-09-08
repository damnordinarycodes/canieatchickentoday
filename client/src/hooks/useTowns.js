import { useEffect, useState } from "react";

export function useTowns() {
  const [towns, setTowns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/towns")
      .then((r) => r.json())
      .then(setTowns)
      .catch(() => setTowns([]))
      .finally(() => setLoading(false));
  }, []);

  return { towns, loading };
}
