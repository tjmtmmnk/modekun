import {
  createKuromojiWorker,
  createKuromojiWorkerApi,
  moderate,
  terminateWorker,
} from "./moderate";
import {
  defaultParamsV2,
  DEFAULT_EXECUTION_INTERVAL_MS,
  getParams,
  IParameterV2,
  keyStreamer,
  KEY_MODEKUN_PARAM,
  OBSERVATION_INTERVAL_MS,
} from "./config";
import { get, set, setItem } from "./storage";
import { selectSource } from "./source/source";
import { IKuromojiWorker } from "./kuromoji";

let worker: Worker | null;
let api: IKuromojiWorker | null;

let lookChats = 0;

let timerId: number;

const getDicPath = () => {
  const isFireFox = window.navigator.userAgent
    .toLowerCase()
    .includes("firefox");

  return isFireFox
    ? "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict"
    : chrome.extension.getURL("kuromoji/dict/");
};

window.addEventListener("load", async () => {
  try {
    // TODO: make compatible for parameter
    const source = selectSource(window.location.href);
    const paramKey = keyStreamer(source.name, source.extractStreamer());
    // XXX: avoid using background
    // TODO: use background
    await set<string>(KEY_MODEKUN_PARAM, paramKey);
    const params = (await get<IParameterV2>(paramKey)) ?? defaultParamsV2;
    await set<IParameterV2>(paramKey, params);

    worker = await createKuromojiWorker();
    api = await createKuromojiWorkerApi(worker, getDicPath());

    const modekun = async () => {
      window.clearTimeout(timerId);
      if (!source) return;

      if (!api) {
        timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
        return;
      }

      const chats = source.extractChats(lookChats);
      if (chats.length < 1) {
        // NOTE: Don't terminate worker here.
        // Because an archive video may be able to open a chat section which was closed at first.
        timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
        return;
      }

      const params = await get<IParameterV2>(paramKey);
      console.log(params);
      if (!params) {
        timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
        return;
      }

      if (!params.isActivateModekun) {
        return;
      }

      lookChats = params.lookChats;

      await moderate(api, params, chats);

      timerId = window.setTimeout(modekun, params.executionInterval);
    };
    timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
  } catch (e) {
    console.error(e);
  }
});

let previousLocation = window.location.href;
const observeLocation = async () => {
  const currentLocation = window.location.href;
  if (currentLocation !== previousLocation) {
    worker && terminateWorker(worker);
    // avoid memory leak, worker allocates a lot of memory
    worker = null;
    api = null;
    worker = await createKuromojiWorker();
    api = await createKuromojiWorkerApi(worker, getDicPath());
    previousLocation = currentLocation;
  }
  window.setTimeout(observeLocation, OBSERVATION_INTERVAL_MS);
};
window.setTimeout(observeLocation, OBSERVATION_INTERVAL_MS);
