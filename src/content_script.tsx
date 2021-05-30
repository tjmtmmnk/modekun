import {
  createKuromojiWorker,
  createKuromojiWorkerApi,
  moderate,
  terminateWorker,
} from "./moderate";
import { Youtube } from "./source/youtube";
import { Mock } from "./source/mock";
import { getItems } from "./storage";
import {
  paramKeys,
  DEFAULT_EXECUTION_INTERVAL_MS,
  defaultParams,
  parseParams,
  serializedParams,
} from "./config";

window.addEventListener("load", async () => {
  const worker = await createKuromojiWorker();
  const api = await createKuromojiWorkerApi(worker);

  const modekun = async () => {
    console.log("modekun");
    const paramsJson = await getItems(paramKeys()).catch(() => defaultParams);

    let params = defaultParams;
    try {
      params = parseParams(paramsJson);
    } catch (e) {
      chrome.storage.sync.set(serializedParams(defaultParams));
    }

    const source = new Mock();
    const chats = source.extractChats();

    if (chats.length < 1) {
      terminateWorker(worker);
    }

    await moderate(api, params, chats);

    window.setTimeout(modekun, params.execution_interval);
  };
  window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
});
