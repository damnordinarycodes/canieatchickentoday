import { useEffect, useState } from "react";
import { fetchStates } from "../api";

export function useStates() {
  const [states, setStates] = useState([]);

  useEffect(() => {
    fetchStates()
      .then(setStates)
      .catch(() => setStates([]));
  }, []);

  return states;
}
