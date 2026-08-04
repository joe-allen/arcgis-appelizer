// this runs in the client's console
export default defineContentScript({
  matches: ["*://*/*"],
  runAt: "document_end",
  main() {
    const title = document.querySelector("title");
    console.log("Hello!", title);
  },
});
