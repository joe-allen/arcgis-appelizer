<script lang="ts">
  import { onMount } from "svelte";
  import github from "../../assets/github.svg";
  import Services from "../../lib/Services.svelte";
  import ProductAnalyzer from "../../lib/ProductAnalyzer.svelte";
  import type { RequestRow } from "../../types";

  let rows = $state<RequestRow[]>([]);

  onMount(async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    const stored = await browser.storage.session.get([
      "networkRequests",
      "networkRequestsTabId",
    ]);
    const storedTabId = stored["networkRequestsTabId"] as
      | number
      | null
      | undefined;
    rows =
      tab?.id === storedTabId
        ? ((stored["networkRequests"] as RequestRow[] | undefined) ?? [])
        : [];
  });
</script>

<main>
  <div class="logo-container">
    <a href="https://www.arcgis.com" target="_blank" rel="noreferrer">
      {#if rows.length > 0}
        <!-- <img src="/icon/128-active.png" class="logo active" alt="ArcGIS Logo" /> -->
        <img src="/agol.svg" class="logo" alt="ArcGIS Logo" />
      {:else}
        <img src="/agol.svg" class="logo" alt="ArcGIS Logo" />
      {/if}
    </a>
    <h1>ArcGIS Appelizer</h1>
    <img src={github} class="logo nohover github" alt="GitHub Logo" />
  </div>

  <div class="card">
    {#if rows.length > 0}
      <ProductAnalyzer />
      <Services />
    {:else}
      <p class="card__message">
        Looks like there are no ArcGIS requests coming from this page.
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
      font-weight: 700;
    }
  }

  .logo {
    height: 64px;
    will-change: filter;
    transition: filter 0.2s ease-out;
  }

  /* .logo.active:hover {
    filter: drop-shadow(0 0 2em var(--c-accent));
  } */

  .logo:hover {
    filter: drop-shadow(0 0 2em var(--c-primary));
  }

  .logo.github {
    opacity: 0.2;
    transition: opacity 0.2s ease-out;
  }

  .logo.github:hover {
    opacity: 1;
  }

  .logo.github {
    height: 21px;
    position: absolute;
    inset: 1rem 0.5rem auto auto;
  }

  .card {
    text-align: start;
    padding: 1em 4px 0;

    & .card__message {
      margin-block-end: 0;
      font-size: 0.875rem;
    }
  }

  @media (prefers-color-scheme: dark) {
    .logo.github {
      filter: invert(1);
    }
  }
</style>
