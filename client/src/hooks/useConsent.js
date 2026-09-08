import { useEffect, useState } from "react";

const STORAGE_KEY = "chicken-day:consent-ack";

export function useConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(STORAGE_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable (private mode, blocked) — just don't nag.
    }
  }, []);

  const dismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Nothing to do if storage is blocked — it'll just show again next visit.
    }
  };

  return { visible, dismiss };
}
