<script lang="ts">
  import { onMount } from "svelte";
  import {
    detectProduct,
    type ProductDetectionResult,
  } from "../utils/detectProduct";

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
    <span><strong>App type</strong></span>
    <span
      >{result.product}
      {#if result.product === "Unknown"}/ Custom{/if}</span
    >
  </div>
  <div class="product-badge" class:unknown={result.product === "Unknown"}>
    <span class="confidence" title={result.signal}
      ><strong>Confidence</strong></span
    >
    <span>{result.confidence}</span>
  </div>
{/if}

<style>
  .product-badge {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    text-transform: capitalize;

    &:last-of-type {
      margin-bottom: 1em;
    }
  }
</style>
