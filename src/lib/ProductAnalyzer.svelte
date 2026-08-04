<script lang="ts">
  import { onMount } from "svelte";
  import { detectProduct, type ProductDetectionResult } from "../utils";

  let result = $state<ProductDetectionResult | null>(null);

  onMount(async () => {
    const [tab] = await browser.tabs.query({
      active: true,
      currentWindow: true,
    });
    result = detectProduct(tab?.url);
  });
</script>

{#if result}
  <div class="product-badge" class:unknown={result.product === "Unknown"}>
    <span class="label">Product</span>
    <span class="value">{result.product}</span>
    <span class="confidence" title={result.signal}
      >{result.confidence} confidence</span
    >
  </div>
{/if}

<style>
  .product-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 10px;
    background: #eef5ff;
    border: 1px solid #b3d1ff;
    border-radius: 6px;
    font-family: system-ui, sans-serif;
    font-size: 12px;
    margin-bottom: 8px;
  }

  .product-badge.unknown {
    background: #f5f5f5;
    border-color: #ccc;
    color: #888;
  }

  .label {
    font-weight: 600;
    color: #555;
  }

  .value {
    font-weight: 700;
    color: #1a56db;
  }

  .unknown .value {
    color: #888;
  }

  .confidence {
    margin-left: auto;
    color: #888;
    cursor: help;
    font-style: italic;
  }
</style>
