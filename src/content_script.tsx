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
import { IKuromojiWorker } from "./kuromoji.worker";

let worker: Worker;
let api: IKuromojiWorker;

window.addEventListener("load", async () => {
  worker = await createKuromojiWorker();
  api = await createKuromojiWorkerApi(worker);

  const modekun = async () => {
    console.log("modekun");
    const params = await getParams().catch(
      async () => await setItem(serializedParams(defaultParams))
    );
    if (!params) return;

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

let currentLocation = window.location.href;
const observeLocation = async () => {
  if (currentLocation !== window.location.href) {
    terminateWorker(worker);
    worker = await createKuromojiWorker();
    api = await createKuromojiWorkerApi(worker);
    currentLocation = window.location.href;
  }
  window.setTimeout(observeLocation, 5000);
};
window.setTimeout(observeLocation, 5000);
