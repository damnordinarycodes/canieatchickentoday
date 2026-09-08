import { useEffect, useState } from "react";

// Minimal client-side router — this app only has 3 real routes (home,
// privacy, terms) plus a 404, so a full router library would be more
// dependency weight than the problem needs.
const NAVIGATE_EVENT = "app:navigate";

export function navigate(path) {
  if (path !== window.location.pathname + window.location.hash) {
    window.history.pushState(null, "", path);
    window.dispatchEvent(new Event(NAVIGATE_EVENT));
  }
}

export function useRoute() {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const onChange = () => setPathname(window.location.pathname);
    window.addEventListener("popstate", onChange);
    window.addEventListener(NAVIGATE_EVENT, onChange);
    return () => {
      window.removeEventListener("popstate", onChange);
      window.removeEventListener(NAVIGATE_EVENT, onChange);
    };
  }, []);

  return pathname;
}

// Wraps <a> so internal links do client-side navigation instead of a full
// page reload, while still behaving like a normal link (new tab, etc.).
export function Link({ href, children, className, onClick, ...rest }) {
  const handleClick = (e) => {
    onClick?.(e);
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (!href.startsWith("/")) return;

    // Same-page hash links (e.g. "/#about" clicked while already on "/")
    // are left to the browser's native anchor scrolling — only a genuine
    // change of page goes through the router.
    const targetPath = href.split("#")[0] || "/";
    if (targetPath === window.location.pathname) return;

    e.preventDefault();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} {...rest}>
      {children}
    </a>
  );
}
