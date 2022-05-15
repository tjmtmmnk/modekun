import {
  createKuromojiWorker,
  createKuromojiWorkerApi,
  moderate,
  terminateWorker,
} from "./moderate";
import {
  defaultParamsV2,
  DEFAULT_EXECUTION_INTERVAL_MS,
  DEFAULT_IS_USE_SAME_PARAM,
  IParameterV2,
  keyStreamer,
  OBSERVATION_INTERVAL_MS,
} from "./config";
import { ISource, selectSource } from "./source/source";
import { IKuromojiWorker } from "./kuromoji";
import { Message, sendRequest } from "./message";
import { SAME_STREAMER } from "./streamer";

class State {
  param: IParameterV2;
  isUseSameParam: boolean;
  isReady: boolean;
  source: ISource;

  constructor() {
    this.param = defaultParamsV2;
    this.isUseSameParam = DEFAULT_IS_USE_SAME_PARAM;
    this.isReady = true;
    this.source = selectSource(window.location.href);
  }

  getParamKey() {
    const paramKey = this.isUseSameParam
      ? keyStreamer(this.source.name, SAME_STREAMER)
      : keyStreamer(this.source.name, this.source.extractStreamer());
    return paramKey;
  }

  updateSource() {
    this.source = selectSource(window.location.href);
  }
}

let timerId: number;
let worker: Worker | null;
let api: IKuromojiWorker | null;

const getDicPath = () => {
  const isFireFox = window.navigator.userAgent
    .toLowerCase()
    .includes("firefox");

  return isFireFox
    ? "https://cdn.jsdelivr.net/npm/kuromoji@0.1.2/dict"
    : chrome.runtime.getURL("kuromoji/dict/");
};

/*
 * set param managed in content_script
 */
const initParam = async () => {
  await sendRequest({
    type: "GET_IS_USE_SAME_PARAM",
    from: "CONTENT_SCRIPT",
    to: "BACKGROUND",
  });
};

const state = new State();

chrome.runtime.onMessage.addListener(
  async (req: Message, sender, sendResponse) => {
    if (req.from === "CONTENT_SCRIPT" || req.to !== "CONTENT_SCRIPT") {
      sendResponse();
      return;
    }
    if (req.type === "UPDATE_PARAM" && req.from === "BACKGROUND") {
      if (!req.data || !req.data.param) throw new Error("no param");
      console.log(`UPDATE param from background`);
      console.log(req.data.param);
      state.param = req.data.param;
      await sendRequest({
        type: "UPDATE_PARAM",
        from: "CONTENT_SCRIPT",
        to: "POPUP",
        data: {
          param: state.param,
        },
      });
    } else if (req.type === "UPDATE_PARAM" && req.from === "POPUP") {
      if (!req.data || !req.data.param) throw new Error("no param");
      console.log(`UPDATE param from popup`);
      console.log(req.data.param);
      state.param = req.data.param;
      await sendRequest({
        type: "UPDATE_PARAM",
        from: "CONTENT_SCRIPT",
        to: "BACKGROUND",
        data: {
          key: state.getParamKey(),
          param: state.param,
        },
      });
    } else if (req.type === "GET_PARAM" && req.from === "POPUP") {
      if (state.isReady) await initParam();
    } else if (
      req.type === "UPDATE_IS_USE_SAME_PARAM" &&
      req.from === "BACKGROUND"
    ) {
      console.log(
        `UPDATE is use same param from background: ${state.isUseSameParam}`
      );
      if (!req.data || req.data.isUseSameParam === undefined)
        throw new Error("no is use same param");
      state.isUseSameParam = !!req.data.isUseSameParam;
      await sendRequest({
        type: "GET_PARAM",
        from: "CONTENT_SCRIPT",
        to: "BACKGROUND",
        data: {
          key: state.getParamKey(),
        },
      });
    } else if (
      req.type === "UPDATE_IS_USE_SAME_PARAM" &&
      req.from === "POPUP"
    ) {
      console.log(
        `UPDATE is use same param from popup: ${state.isUseSameParam}`
      );
      if (!req.data || req.data.isUseSameParam === undefined)
        throw new Error("no is use same param");
      state.isUseSameParam = !!req.data.isUseSameParam;
      await sendRequest({
        type: "UPDATE_IS_USE_SAME_PARAM",
        from: "CONTENT_SCRIPT",
        to: "BACKGROUND",
        data: { isUseSameParam: state.isUseSameParam },
      });
    } else if (req.type === "RELOAD" && req.from === "POPUP") {
      console.log("reload");
      await initParam();
    }
    sendResponse();
  }
);

window.addEventListener("load", async () => {
  try {
    const source = selectSource(window.location.href);
    await initParam();

    worker = await createKuromojiWorker();
    api = await createKuromojiWorkerApi(worker, getDicPath());

    const modekun = async () => {
      window.clearTimeout(timerId);

      const chats = source.extractChats(state.param.lookChats);
      if (chats.length < 1) {
        // NOTE: Don't terminate worker here.
        // Because an archive video may be able to open a chat section which was closed at first.
        timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
        return;
      }

      if (!api) {
        timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
        return;
      }

      if (!state.param.isActivateModekun) {
        timerId = window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
        return;
      }

      await moderate(api, state.param, chats);

      timerId = window.setTimeout(modekun, state.param.executionInterval);
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
    state.isReady = false;
    // XXX: wait 3s for render complete
    await new Promise((r) => setTimeout(r, 3000));

    state.isReady = true;

    await initParam();

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
