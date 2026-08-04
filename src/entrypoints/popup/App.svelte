<script lang="ts">
  import { onMount } from "svelte";
  import svelteLogo from "../../assets/svelte.svg";
  import DevTools from "../../lib/DevTools.svelte";
  import ProductAnalyzer from "../../lib/ProductAnalyzer.svelte";

  onMount(async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    browser.runtime.sendMessage({ type: "clearRequests", url: tab?.url });
  });
</script>

<main>
  <div>
    <a href="https://wxt.dev" target="_blank" rel="noreferrer">
      <img src="/wxt.svg" class="logo" alt="WXT Logo" />
    </a>
    <a href="https://svelte.dev" target="_blank" rel="noreferrer">
      <img src={svelteLogo} class="logo svelte" alt="Svelte Logo" />
    </a>
  </div>
  <h1>ArcGIS Appelizer</h1>

  <div class="card">
    <ProductAnalyzer />
    <DevTools />
  </div>
</main>

<style>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #54bc4ae0);
  }
  .logo.svelte:hover {
    filter: drop-shadow(0 0 2em #ff3e00aa);
  }
  .read-the-docs {
    color: #888;
  }
</style>
