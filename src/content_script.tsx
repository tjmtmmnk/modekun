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
  isParameter,
  KEY_NG_WORDS,
  defaultParams,
} from "./config";

window.addEventListener("load", async () => {
  const worker = await createKuromojiWorker();
  const api = await createKuromojiWorkerApi(worker);

  const modekun = async () => {
    console.log("modekun");
    const paramsJson = await getItems(paramKeys()).catch(() => defaultParams);
    const params: any =
      JSON.stringify(paramsJson) === JSON.stringify({})
        ? defaultParams
        : {
            ...paramsJson,
            ng_words: JSON.parse(paramsJson[KEY_NG_WORDS]),
          };

    if (!isParameter(params)) {
      terminateWorker(worker);
      return;
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
