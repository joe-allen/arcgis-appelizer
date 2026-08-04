// Custom DevTools panel: mounts the Svelte component that renders a live
// table of finished network requests.
import { mount } from "svelte";
import DevTools from "../../lib/DevTools.svelte";

const app = mount(DevTools, {
  target: document.getElementById("app")!,
});

export default app;
