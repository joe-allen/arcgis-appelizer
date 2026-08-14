/** URL must contain this substring to be considered an ArcGIS service request. */
const REQUIRED_PATTERN = "rest/services";

/** Requests matching any of these substrings are excluded. */
const EXCLUDED_PATTERNS = [
  ".pbf",
  ".css",
  ".ico",
  "f=pbf",
  "/query",
  "/MapServer/tile",
  "/MapServer/legend",
  "/attachments/",
];

/** Requests matching any of these regexes are excluded. */
const EXCLUDED_REGEXES = [
  // Exclude VectorTileServer sub-resources, but keep the bare endpoint
  // (".../VectorTileServer" or ".../VectorTileServer/").
  /VectorTileServer\/.+/,
];

/**
 * Returns true if the URL should be captured as a network request row.
 * Must match the required pattern and none of the excluded patterns.
 */
export function captureRequest(url: string): boolean {
  if (!url.includes(REQUIRED_PATTERN)) return false;
  if (EXCLUDED_PATTERNS.some((pattern) => url.includes(pattern))) return false;
  return !EXCLUDED_REGEXES.some((re) => re.test(url));
}
