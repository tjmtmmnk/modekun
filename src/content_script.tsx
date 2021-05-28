import { moderate } from "./moderate";
import { Youtube } from "./youtube";
import { TestSource } from "./testSource";
import { getItems } from "./storage";
import {
  paramKeys,
  DEFAULT_EXECUTION_INTERVAL_MS,
  isParameter,
} from "./config";

window.addEventListener("load", async () => {
  const modekun = async () => {
    console.log("modekun");
    const params = await getItems(paramKeys());
    if (!isParameter(params)) return;

    const source = new TestSource();
    const chats = source.extractChats();
    moderate(params, chats);

    window.setTimeout(modekun, params.execution_interval);
  };
  window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
});
