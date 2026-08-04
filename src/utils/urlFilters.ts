/** URL must contain this substring to be considered an ArcGIS service request. */
const REQUIRED_PATTERN = "rest/services";

/** Requests matching any of these substrings are excluded. */
const EXCLUDED_PATTERNS = [
  ".pbf",
  ".css",
  ".ico",
  "f=pbf",
  "VectorTileServer",
  "/query",
  "/MapServer/tile",
  "/MapServer/legend",
  "/attachments/",
];

/**
 * Returns true if the URL should be captured as a network request row.
 * Must match the required pattern and none of the excluded patterns.
 */
export function captureRequest(url: string): boolean {
  if (!url.includes(REQUIRED_PATTERN)) return false;
  return !EXCLUDED_PATTERNS.some((pattern) => url.includes(pattern));
}
