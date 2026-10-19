/**
 * Sanitizes URLs passed to iframes or links to prevent DOM-based XSS (e.g. javascript: or data: URIs).
 * Resolves CodeQL 'DOM text reinterpreted as HTML' security alert.
 */
export function sanitizeIframeSrc(url) {
  if (!url || typeof url !== "string") return "about:blank";
  const trimmed = url.trim();
  if (trimmed === "about:blank") return "about:blank";
  if (trimmed.startsWith("/")) return trimmed;
  try {
    const origin = typeof window !== "undefined" && window.location?.origin ? window.location.origin : "http://localhost";
    const parsed = new URL(trimmed, origin);
    if (parsed.protocol === "https:" || parsed.protocol === "http:") {
      return parsed.href;
    }
  } catch {}
  return "about:blank";
}
