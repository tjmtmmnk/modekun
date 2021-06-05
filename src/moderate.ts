import { IChat } from "./chat";
import { IKuromojiWorker, KuromojiWorker } from "./kuromoji.worker";
import { wrap } from "comlink";
import { IParameter } from "./config";

export const createKuromojiWorker = async (): Promise<Worker> => {
  const worker = await fetch(chrome.extension.getURL("js/worker.js"));
  const js = await worker.text();
  const blob = new Blob([js], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);

  return new Worker(url);
};

export const createKuromojiWorkerApi = async (
  worker: Worker
): Promise<IKuromojiWorker> => {
  const workerClass: any = wrap<IKuromojiWorker>(worker);
  const instance = await new workerClass(
    chrome.extension.getURL("kuromoji/dict/")
  );
  return instance;
};

export const terminateWorker = (worker: Worker | undefined) => {
  worker && worker.terminate();
};

export const hideRepeatThrow = (param: IParameter, chats: IChat[]) => {
  const duplicateCount: { [key: string]: number } = {};
  for (const chat of chats) {
    if (!duplicateCount[chat.key]) {
      duplicateCount[chat.key] = 0;
    }
    duplicateCount[chat.key]++;
  }
  for (const chat of chats) {
    if (duplicateCount[chat.key] >= param.repeat_throw_threshold) {
      hide(chat);
    }
  }
};

export const hideNgWords = (param: IParameter, chats: IChat[]) => {
  for (const chat of chats) {
    for (const ngWord of param.ng_words) {
      if (chat.message.includes(ngWord)) {
        hide(chat);
      }
    }
  }
};

export const hideRepeatWords = async (
  param: IParameter,
  api: IKuromojiWorker,
  chats: IChat[]
) => {
  const counts = await api.getMaxRepeatWordCounts(chats.map((c) => c.message));
  chats.forEach((chat, i) => {
    if (counts[i] >= param.repeat_word_threshold) {
      hide(chat);
    }
  });
};

export const moderate = async (
  kuromojiWorkerApi: IKuromojiWorker,
  param: IParameter,
  chats: IChat[]
): Promise<void> => {
  const publicChats = chats
    .slice(-param.look_chats)
    .filter((chat) => !chat.element.dataset.isHiddenByModekun);

  hideRepeatThrow(param, publicChats);
  hideNgWords(param, publicChats);
  hideRepeatWords(param, kuromojiWorkerApi, publicChats);
};

const hide = (chat: IChat) => {
  if (!chat.element.dataset.isHiddenByModekun) {
    chat.element.style.display = "none";
    chat.element.dataset.isHiddenByModekun = "1";
  }
};
