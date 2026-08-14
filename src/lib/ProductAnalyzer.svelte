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
  <div class="product-badge__wrap">
    <div class="product-badge" class:unknown={result.product === "Unknown"}>
      <span><strong>App type:</strong></span>
      <span class="confidence" title={result.signal}
        ><strong>Confidence:</strong></span
      >
    </div>
    <div class="product-badge" class:unknown={result.product === "Unknown"}>
      <span
        >{result.product}
        {#if result.product === "Unknown"}/ Custom{/if}</span
      >
      <span>{result.confidence}</span>
    </div>
  </div>
{/if}

<style>
  .product-badge__wrap {
    display: flex;
    gap: 0.5rem;
  }

  .product-badge {
    display: flex;
    flex-direction: column;
    /* justify-content: space-between; */
    font-size: 12px;
    text-transform: capitalize;

    &:last-of-type {
      margin-bottom: 1em;
    }
  }
</style>
