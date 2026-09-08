import { useEffect } from "react";

// Updates the tab title and meta description for the current route.
// index.html's static tags cover the home page for the initial load and for
// crawlers/social scrapers that don't execute JS; this keeps the tab itself
// (and any client-side-only re-share) accurate on the /privacy and /terms
// sub-pages too.
export function usePageMeta(title, description) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    let meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute("content");
    if (meta && description) meta.setAttribute("content", description);

    return () => {
      document.title = prevTitle;
      if (meta && prevDescription) meta.setAttribute("content", prevDescription);
    };
  }, [title, description]);
}
