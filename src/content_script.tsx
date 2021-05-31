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
  OBSERVATION_INTERVAL_MS,
  YOUTUBE_REGEX,
  MILDOM_REGEX,
} from "./config";
import { setItem } from "./storage";
import { IKuromojiWorker } from "./kuromoji.worker";
import { Mildom } from "./source/mildom";
import { ISource } from "./source/source";

let worker: Worker;
let api: IKuromojiWorker;
let source: ISource;

window.addEventListener("load", async () => {
  worker = await createKuromojiWorker();
  api = await createKuromojiWorkerApi(worker);
  source = new Youtube();

  const modekun = async () => {
    console.log("modekun");
    
    const chats = source.extractChats();
    if (chats.length < 1) {
      terminateWorker(worker);
      window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
      return;
    }

    const params = await getParams().catch(
      async () => await setItem(serializedParams(defaultParams))
    );
    if (!params) return;

    await moderate(api, params, chats);

    window.setTimeout(modekun, params.execution_interval);
  };
  window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
});

let currentLocation = window.location.href;
const observeLocation = async () => {
  if (YOUTUBE_REGEX.test(currentLocation)) {
    source = new Youtube();
  } else if (MILDOM_REGEX.test(currentLocation)) {
    source = new Mildom();
  } else {
    source = new Mock();
  }
  if (currentLocation !== window.location.href) {
    terminateWorker(worker);
    worker = await createKuromojiWorker();
    api = await createKuromojiWorkerApi(worker);
    currentLocation = window.location.href;
  }
  window.setTimeout(observeLocation, OBSERVATION_INTERVAL_MS);
};
window.setTimeout(observeLocation, OBSERVATION_INTERVAL_MS);
