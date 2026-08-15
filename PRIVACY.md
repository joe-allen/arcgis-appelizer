# Privacy Policy — ArcGIS Appelizer

_Last updated: August 15, 2026_

## Overview

ArcGIS Appelizer is a browser extension that detects and displays the ArcGIS
REST service requests made by the web page you are currently viewing. This
policy explains what the extension does and does not do with your data.

## Data We Collect

ArcGIS Appelizer does **not** collect, store, sell, or transmit any personal
information. The extension does not use analytics, tracking, or advertising.

## How the Extension Works

- The extension observes completed network requests on the active tab to
  identify ArcGIS REST service URLs (those containing `rest/services`).
- Matching request URLs are stored temporarily in your browser's session
  storage (`storage.session`) solely so they can be displayed in the extension
  popup.
- This data never leaves your device. It is cleared automatically when the tab
  navigates away, when the tab is closed, or when the browser session ends.

## Permissions

- **webRequest / host access**: required to observe request URLs on any site,
  because ArcGIS services can be hosted on any domain.
- **storage**: required to hold the captured request list for the current
  session.
- **tabs**: required to identify the active tab, clear data on navigation, and
  open a selected service URL in a new tab.

The extension does not read page content, browsing history, cookies, or any
personal data.

## Third Parties

No data is shared with any third party. No data is sent to the developer or any
external server.

## Changes to This Policy

Any changes to this policy will be posted at this URL.

## Contact

For questions about this policy, please create an issue in this repo.
