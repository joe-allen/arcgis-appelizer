import { captureRequest } from "../utils/urlFilters";

export default defineBackground(() => {
  const STORAGE_KEY = "networkRequests";
  const MAX_ROWS = 500;

  type RequestRow = {
    size: number;
    url: string;
  };

  // In-memory buffer, hydrated from session storage so it survives brief
  // service-worker restarts within the same browser session.
  let rows: RequestRow[] = [];
  const hydrated = browser.storage.session
    .get(STORAGE_KEY)
    .then((stored) => {
      rows = (stored[STORAGE_KEY] as RequestRow[] | undefined) ?? [];
    })
    .catch(() => {});

  const LAST_URL_KEY = "lastTabUrl";

  browser.runtime.onMessage.addListener((message) => {
    if (message?.type === "clearRequests") {
      const incomingUrl: string | undefined = message.url;
      browser.storage.session.get(LAST_URL_KEY).then((stored) => {
        const lastUrl = stored[LAST_URL_KEY] as string | undefined;
        const urlChanged = lastUrl !== undefined && incomingUrl !== lastUrl;
        if (urlChanged) {
          rows = [];
          void browser.storage.session.set({ [STORAGE_KEY]: [] });
        }
        void browser.storage.session.set({ [LAST_URL_KEY]: incomingUrl });
      });
    }
  });

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
        void browser.storage.session.set({ [STORAGE_KEY]: rows });
      });
    },
    { urls: ["<all_urls>"] },
    ["responseHeaders"],
  );

  // Reset to default icon when the tab navigates away.
  browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status === "loading") {
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
