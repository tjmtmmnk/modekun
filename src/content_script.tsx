import { moderate } from "./moderate";
import { Youtube } from "./youtube";
import { TestSource } from "./testSource";

window.addEventListener("load", async () => {
  const modekun = async () => {
    const source = new TestSource();
    const chats = source.extractChats();

    moderate(chats);
  };
  window.setInterval(modekun, 5000);
});
