import { moderate } from "./moderate";
import { Youtube } from "./source/youtube";
import { Mock } from "./source/mock";
import { getItems } from "./storage";
import {
  paramKeys,
  DEFAULT_EXECUTION_INTERVAL_MS,
  isParameter,
  KEY_NG_WORDS,
} from "./config";

window.addEventListener("load", async () => {
  const modekun = async () => {
    console.log("modekun");
    const paramsJson = await getItems(paramKeys());
    const params: any = {
      ...paramsJson,
      ng_words: JSON.parse(paramsJson[KEY_NG_WORDS]),
    };

    if (!isParameter(params)) return;

    const source = new Youtube();
    const chats = source.extractChats();
    await moderate(params, chats);

    window.setTimeout(modekun, params.execution_interval);
  };
  window.setTimeout(modekun, DEFAULT_EXECUTION_INTERVAL_MS);
});
