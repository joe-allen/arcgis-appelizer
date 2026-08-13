<script lang="ts">
  import { onMount } from "svelte";
  // import svelteLogo from "../../assets/svelte.svg";
  import DevTools from "../../lib/DevTools.svelte";
  import ProductAnalyzer from "../../lib/ProductAnalyzer.svelte";

  let rows = $state<
    { method: string; status: number; size: number; url: string }[]
  >([]);

  onMount(async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    browser.runtime.sendMessage({ type: "clearRequests", url: tab?.url });

    const stored = await browser.storage.session.get("networkRequests");
    rows = (stored["networkRequests"] as RequestRow[] | undefined) ?? [];
  });
</script>

<main>
  <div class="logo-container">
    <a href="https://www.arcgis.com" target="_blank" rel="noreferrer">
      {#if rows.length > 0}
        <img src="/icon/128-active.png" class="logo active" alt="ArcGIS Logo" />
      {:else}
        <img src="/agol.svg" class="logo" alt="ArcGIS Logo" />
      {/if}
    </a>
    <h1>ArcGIS Appelizer</h1>
  </div>

  <div class="card">
    {#if rows.length > 0}
      <ProductAnalyzer />
      <DevTools />
    {:else}
      <p class="card__message">
        No ArcGIS Product or content requests captured for this page.
      </p>
    {/if}
  </div>
</main>

<style>
  .logo-container {
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 1em;
    width: 100%;
    padding-inline: 0.15rem;

    & h1 {
      font-size: 1.25em;
      font-weight: 600;
    }
  }
  .logo {
    height: 64px;
    will-change: filter;
    transition: filter 0.2s ease-out;
  }
  .logo.active:hover {
    filter: drop-shadow(0 0 2em var(--c-accent));
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em var(--c-primary));
  }

  .card {
    text-align: start;
    padding: 1em 4px 0;

    & .card__message {
      margin-block-end: 0;
    }
  }
</style>
