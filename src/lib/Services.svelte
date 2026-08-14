<script lang="ts">
  import { onMount } from "svelte";

  // Requests are captured by the background service worker via
  // `browser.webRequest` and stored in `storage.session`. Reading from storage
  // lets this component populate in ANY extension context (popup or panel),
  // not just the DevTools panel.

  type RequestRow = {
    method: string;
    status: number;
    size: number;
    url: string;
  };

  const STORAGE_KEY = "networkRequests";

  let rows = $state<RequestRow[]>([]);

  function formatSize(bytes: number): string {
    if (bytes < 0) return "—";
    if (bytes < 1024) return `${bytes} B`;
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  function serviceName(url: string): string {
    const match = url.match(/\/services\/([^/]+)/);
    if (!match) return url; // fallback to full URL
    return match[1]
      .replace(/[_-]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  }

  function layerNumber(url: string): string {
    const match = url.match(/\/(\d+)\/?$/);
    return match ? `${match[1]}` : "";
  }

  onMount(() => {
    // Initial load.
    browser.storage.session.get(STORAGE_KEY).then((stored) => {
      rows = (stored[STORAGE_KEY] as RequestRow[] | undefined) ?? [];
    });

    // Live updates whenever the background writes a new request.
    const onChanged = (
      changes: Record<string, { newValue?: unknown }>,
      area: string,
    ) => {
      if (area === "session" && changes[STORAGE_KEY]) {
        rows =
          (changes[STORAGE_KEY].newValue as RequestRow[] | undefined) ?? [];
      }
    };

    browser.storage.onChanged.addListener(onChanged);
    return () => browser.storage.onChanged.removeListener(onChanged);
  });
</script>

<table>
  <thead>
    <tr>
      <th>Requests</th>
      <th>Size</th>
    </tr>
  </thead>
  <tbody>
    {#each rows as row}
      <tr>
        <td class="url" title={row.url}
          ><a
            href={row.url}
            onclick={(e) => {
              e.preventDefault();
              browser.tabs.create({ url: row.url, active: false });
            }}
          >
            <span>{serviceName(row.url)}</span>
            {#if layerNumber(row.url)}
              <span> ({layerNumber(row.url)})</span>
            {/if}
          </a></td
        >
        <td>{formatSize(row.size)}</td>
      </tr>
    {/each}
  </tbody>
</table>

<style>
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 12px;
  }

  th,
  td {
    text-align: left;
    padding: 4px 4px 0;
    border-bottom: 1px solid var(--c-border);

    a {
      display: inline-block;
    }
  }

  th {
    position: sticky;
    background: var(--c-background);
    padding: 4px 0;
    top: 1rem;

    &::after {
      content: "";
      position: absolute;
      inset: -1rem 0 0;
      height: 1rem;
      width: 100%;
      background: var(--c-background);
    }
  }

  tr:last-child td {
    border-bottom: none;
  }

  th:last-child,
  td:last-child {
    text-align: right;
  }

  .url {
    max-width: 480px;
    word-break: break-all;
  }
</style>
