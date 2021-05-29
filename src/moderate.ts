import { IChat } from "./chat";
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
      hide("連投", chat);
    }
  }
};

export const hideNgWords = (param: IParameter, chats: IChat[]) => {
  for (const chat of chats) {
    for (const ngWord of param.ng_words) {
      if (chat.message.includes(ngWord)) {
        hide("NGワード", chat);
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
      hide("単語繰り返し", chat);
    }
  });
};

export const moderate = async (
  param: IParameter,
  chats: IChat[]
): Promise<void> => {
  if (chats.length < 1) return;

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

const hide = (type: string, chat: IChat) => {
  if (!chat.element.dataset.isHiddenByModekun) {
    console.log(`[${type}] hide ${chat.author} ${chat.message}`);

    chat.element.style.display = "none";
    chat.element.dataset.isHiddenByModekun = "1";
  }
};
