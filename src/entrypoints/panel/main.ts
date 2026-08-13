// Custom DevTools panel: mounts the Svelte component that renders a live
// table of finished network requests.
import { mount } from "svelte";
import Services from "../../lib/Services.svelte";

const app = mount(Services, {
  target: document.getElementById("app")!,
});

export default app;
