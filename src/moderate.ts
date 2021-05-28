import { Chat } from "./chat";
import { IKuromojiWorker, KuromojiWorker } from "./kuromoji.worker";
import { wrap } from "comlink";
import { IParameter } from "./config";

const createKuromojiWorker = async (): Promise<KuromojiWorker> => {
  const worker = await fetch(chrome.extension.getURL("js/worker.js"));
  const js = await worker.text();
  const blob = new Blob([js], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const workerClass: any = wrap<KuromojiWorker>(new Worker(url));
  const instance = await new workerClass(
    chrome.extension.getURL("kuromoji/dict/")
  );
  return instance;
};

export const hideRepeatThrow = (param: IParameter, chats: Chat[]) => {
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

export const hideNgWords = (param: IParameter, chats: Chat[]) => {
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
  chats: Chat[]
) => {
  const counts = await api.getMaxRepeatWordCounts(chats.map((c) => c.message));
  chats.forEach((chat, i) => {
    if (counts[i] > param.repeat_word_threshold) {
      hide(chat);
    }
  });
};

export const moderate = async (
  param: IParameter,
  chats: Chat[]
): Promise<void> => {
  const kuromojiWorkerApi = await createKuromojiWorker();
  const publicChats = chats
    .filter(
      (chat) =>
        !chat.element.dataset.isHiddenByModekun &&
        !chat.element.dataset.hasSeenByModekun
    )
    .slice(-param.look_chats);

  for (const chat of publicChats) {
    chat.element.dataset.hasSeenByModekun = "1";
  }
  hideRepeatThrow(param, publicChats);
  hideNgWords(param, publicChats);
  hideRepeatWords(param, kuromojiWorkerApi, publicChats);
};

const hide = (chat: Chat) => {
  if (!chat.element.dataset.isHiddenByModekun) {
    console.log(`hide ${chat.author} ${chat.message}`);

    chat.element.style.display = "none";
    chat.element.dataset.isHiddenByModekun = "1";
  }
};
