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
            }}>{row.url}</a
          ></td
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
    padding: 4px 8px 4px 0;
    border-bottom: 1px solid #ddd;

    a {
      display: inline-block;
    }
  }
  th {
    position: sticky;
    padding: 4px 0;
    top: 0;
  }
  tr:last-child td {
    border-bottom: none;
  }
  .url {
    max-width: 480px;
    word-break: break-all;
  }
</style>
