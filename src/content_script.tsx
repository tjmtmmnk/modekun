import {
  createKuromojiWorker,
  createKuromojiWorkerApi,
  moderate,
  terminateWorker,
} from "./moderate";
import { Youtube } from "./source/youtube";
import { Mock } from "./source/mock";
import {
  DEFAULT_EXECUTION_INTERVAL_MS,
  defaultParams,
  serializedParams,
  getParams,
} from "./config";
import { setItem } from "./storage";

window.addEventListener("load", async () => {
  const worker = await createKuromojiWorker();
  const api = await createKuromojiWorkerApi(worker);

  const modekun = async () => {
    console.log("modekun");
    const params = await getParams().catch(
      async () => await setItem(serializedParams(defaultParams))
    );
    if (!params) return;

    const source = new Youtube();
    const chats = source.extractChats();

    if (chats.length < 1) {
      terminateWorker(worker);
    }

    await moderate(api, params, chats);

    window.setTimeout(modekun, params.execution_interval);
  };
  window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
});
