export type ArcGISProduct =
  | "Hub"
  | "Experience Builder"
  | "Dashboards"
  | "Unknown";

export interface ProductDetectionResult {
  product: ArcGISProduct;
  confidence: "high" | "medium" | "low";
  signal: string;
}

/** Check URL-based patterns — fastest and most reliable. */
function detectFromUrl(url: string): ProductDetectionResult | null {
  if (/hub\.arcgis\.com|opendata\.arcgis\.com/.test(url)) {
    return {
      product: "Hub",
      confidence: "high",
      signal: "URL matches hub.arcgis.com",
    };
  }
  if (/experience\.arcgis\.com|\/apps\/experiencebuilder\//i.test(url)) {
    return {
      product: "Experience Builder",
      confidence: "high",
      signal: "URL matches experience.arcgis.com",
    };
  }
  if (/arcgis\.com\/apps\/dashboards\/|opsdashboard/i.test(url)) {
    return {
      product: "Dashboards",
      confidence: "high",
      signal: "URL matches dashboards path",
    };
  }
  return null;
}

/** Check DOM signals — runs inside the page via content script message. */
function detectFromDom(): ProductDetectionResult | null {
  // Hub
  if (
    document.querySelector("arcgis-hub-header, hub-app, [class*='hub-app']")
  ) {
    return {
      product: "Hub",
      confidence: "high",
      signal: "Found Hub custom elements in DOM",
    };
  }
  const generator =
    document.querySelector<HTMLMetaElement>("meta[name='generator']")
      ?.content ?? "";
  if (/hub/i.test(generator)) {
    return {
      product: "Hub",
      confidence: "medium",
      signal: `meta[generator]: ${generator}`,
    };
  }

  // Experience Builder
  if (document.querySelector("[class*='jimu-']")) {
    return {
      product: "Experience Builder",
      confidence: "high",
      signal: "Found jimu-* CSS classes in DOM",
    };
  }
  const scripts = Array.from(
    document.querySelectorAll<HTMLScriptElement>("script[src]"),
  ).map((s) => s.src);
  if (scripts.some((s) => /jimu-core|experiencebuilder/i.test(s))) {
    return {
      product: "Experience Builder",
      confidence: "medium",
      signal: "Found jimu/ExB script in page",
    };
  }

  // Dashboards
  if (document.querySelector("arcgis-dashboard")) {
    return {
      product: "Dashboards",
      confidence: "high",
      signal: "Found <arcgis-dashboard> element",
    };
  }
  if (document.querySelector(".ember-application")) {
    return {
      product: "Dashboards",
      confidence: "medium",
      signal: "Found Ember.js root (legacy Dashboard)",
    };
  }

  return null;
}

/**
 * Detect the ArcGIS product for the current page.
 * Pass `url` when calling from a non-page context (popup/background).
 * DOM checks only work when called from a content script.
 */
export function detectProduct(url?: string): ProductDetectionResult {
  if (url) {
    const fromUrl = detectFromUrl(url);
    if (fromUrl) return fromUrl;
  }

  const fromDom = detectFromDom();
  if (fromDom) return fromDom;

  return {
    product: "Unknown",
    confidence: "low",
    signal: "No identifying signals found",
  };
}
