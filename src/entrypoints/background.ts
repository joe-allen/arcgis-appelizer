import { captureRequest } from "../utils/urlFilters";
import type { RequestRow } from "../types";

export default defineBackground(() => {
  const STORAGE_KEY = "networkRequests";
  const TAB_KEY = "networkRequestsTabId";
  const MAX_ROWS = 500;

  // In-memory buffer, hydrated from session storage so it survives brief
  // service-worker restarts within the same browser session.
  let rows: RequestRow[] = [];
  let trackedTabId: number | null = null;
  const hydrated = browser.storage.session
    .get([STORAGE_KEY, TAB_KEY])
    .then((stored) => {
      rows = (stored[STORAGE_KEY] as RequestRow[] | undefined) ?? [];
      trackedTabId = (stored[TAB_KEY] as number | null | undefined) ?? null;
    })
    .catch(() => {});

  browser.webRequest.onCompleted.addListener(
    (details) => {
      if (!captureRequest(details.url)) {
        return;
      }

      const contentLength = details.responseHeaders?.find(
        (h) => h.name.toLowerCase() === "content-length",
      )?.value;

      const row: RequestRow = {
        size: contentLength ? Number(contentLength) : -1,
        url: details.url.split("?")[0],
      };

      hydrated.finally(() => {
        if (details.tabId >= 0) {
          void browser.action.setIcon({
            tabId: details.tabId,
            path: {
              16: "/icon/16-active.png",
              32: "/icon/32-active.png",
              48: "/icon/48-active.png",
              96: "/icon/96-active.png",
              128: "/icon/128-active.png",
            },
          });
        }

        // Skip if this URL is already recorded (query string already stripped).
        if (rows.some((r) => r.url === row.url)) return;

        rows.unshift(row);
        if (rows.length > MAX_ROWS) rows.length = MAX_ROWS;
        trackedTabId = details.tabId;
        void browser.storage.session.set({
          [STORAGE_KEY]: rows,
          [TAB_KEY]: trackedTabId,
        });
      });
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"],
  );

  // Clear captured data and reset icon when the tracked tab navigates.
  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading") {
      if (tabId === trackedTabId) {
        rows = [];
        trackedTabId = null;
        void browser.storage.session.set({
          [STORAGE_KEY]: [],
          [TAB_KEY]: null,
        });
      }
      void browser.action.setIcon({
        tabId,
        path: {
          16: "/icon/16.png",
          32: "/icon/32.png",
          48: "/icon/48.png",
          96: "/icon/96.png",
          128: "/icon/128.png",
        },
      });
    }
  });
});
