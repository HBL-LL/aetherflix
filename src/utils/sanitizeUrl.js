import DOMPurify from "dompurify";

/**
 * Sanitizes URLs passed to iframes or links to prevent DOM-based XSS (e.g. javascript: or data: URIs).
 * Resolves CodeQL 'DOM text reinterpreted as HTML' security alert (CWE-79).
 */
export function sanitizeIframeSrc(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return "about:blank";
  const url = rawUrl.trim();
  if (url === "" || url === "about:blank") return "about:blank";
  // Strict protocol check: only allow http:, https:, or root-relative / paths
  if (!/^(?:https?:\/\/|\/[^\/])/i.test(url) || /^(?:javascript|data|vbscript):/i.test(url)) {
    return "about:blank";
  }
  const clean = DOMPurify.sanitize(url);
  return encodeURI(clean) || "about:blank";
}
