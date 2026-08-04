# WXT + Svelte

This template should help get you started developing with Svelte in WXT.

## How it works:

- background.ts — listens to browser.webRequest.onCompleted for all URLs, reads Content-Length for the size, and keeps the last 100 requests in storage.session (with an in-memory buffer hydrated on startup to survive service-worker restarts).
- DevTools.svelte — no longer depends on browser.devtools.\*. It loads rows from storage.session on mount and subscribes to storage.onChanged, so it updates live. This is why it now works in both the popup and the panel.
- wxt.config.ts — added the required webRequest + storage permissions and <all_urls> host access.

## Behavior notes:

- Data now comes from webRequest, not the DevTools HAR, so size is the Content-Length header when present (compressed/chunked responses may show —), and it captures traffic browser-wide, not just the inspected tab.
- The > 40 KB console-logging and inspectedWindow.eval behavior was DevTools-only and is gone, since the popup has no inspected window. If you want to keep that flag specifically in the panel, I can add a panel-only branch back.

## Logging

- "devtools/main.ts" inspectedWindow.eval → inspected page's Console (the tab you opened DevTools on).
- "background.ts" logs → service worker console (chrome://extensions → your extension → "service worker").
- panel/ or popup/ component logs → right-click that panel/popup → Inspect to get its own DevTools/console.
