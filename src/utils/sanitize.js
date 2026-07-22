/**
 * Sanitizes a raw text input before it is ever stored in state or
 * localStorage. Strips <script> blocks first (so their inner content
 * doesn't leak through as plain text), then strips any remaining HTML
 * tags, then trims whitespace.
 *
 * This is defense-in-depth for a client-only app: React already escapes
 * text content on render, but we still never want markup persisted in
 * localStorage or echoed into attributes/values.
 */
export function sanitizeInput(value) {
  if (typeof value !== 'string') return value;

  return value
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .trim();
}
