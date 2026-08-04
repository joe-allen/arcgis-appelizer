// DevTools page entrypoint.
// Runs in the special DevTools context, where the `browser.devtools.*` APIs
// (network, panels, inspectedWindow) are available. No permissions required.

// Register a custom panel that appears alongside Elements, Console, Network, etc.
// browser.devtools.panels.create(
//   "Appelizer",
//   "", // panel icon (optional)
//   "panel.html",
// );

// Log every finished network request seen in the inspected tab.
// `request` is a HAR entry (https://developer.chrome.com/docs/extensions/reference/api/devtools/network).
browser.devtools.network.onRequestFinished.addListener((request) => {
  // Flag large image responses (> 40 KB) in the inspected page's console.
  if (request.response.bodySize > 40 * 1024) {
    browser.devtools.inspectedWindow.eval(
      'console.log("Large file: " + unescape("' +
        escape(request.request.url) +
        '"))',
    );
  }
});
