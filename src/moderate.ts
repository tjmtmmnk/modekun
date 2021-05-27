import { Chat } from "./chat";
import { IKuromojiWorker, KuromojiWorker } from "./kuromoji.worker";
import { wrap } from "comlink";

const REPEAT_THROW_THRESHOLD = 2;
const REPEAT_WORD_THRESHOLD = 2;
const LOOK_CHATS = 50;

export const DEFAULT_REPEAT_THROW_THRESHOLD = 2;
export const DEFAULT_REPEAT_WORD_THRESHOLD = 2;
export const DEFAULT_LOOK_CHATS = 50;
const NG_WORDS = ["なう"];

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

export const hideRepeatThrow = (chats: Chat[]) => {
  const duplicateCount: { [key: string]: number } = {};
  for (const chat of chats) {
    if (!duplicateCount[chat.key]) {
      duplicateCount[chat.key] = 0;
    }
    duplicateCount[chat.key]++;
  }
  for (const chat of chats) {
    if (duplicateCount[chat.key] >= REPEAT_THROW_THRESHOLD) {
      hide(chat);
    }
  }
};

export const hideNgWords = (chats: Chat[]) => {
  for (const chat of chats) {
    for (const ngWord of NG_WORDS) {
      if (chat.message.includes(ngWord)) {
        hide(chat);
      }
    }
  }
};

export const hideRepeatWords = async (api: IKuromojiWorker, chats: Chat[]) => {
  const counts = await api.getMaxRepeatWordCounts(chats.map((c) => c.message));
  chats.forEach((chat, i) => {
    if (counts[i] > REPEAT_WORD_THRESHOLD) {
      hide(chat);
    }
  });
};

export const moderate = async (chats: Chat[]) => {
  const kuromojiWorkerApi = await createKuromojiWorker();
  const publicChats = chats
    .filter(
      (chat) =>
        !chat.element.dataset.isHiddenByModekun &&
        !chat.element.dataset.hasSeenByModekun
    )
    .slice(-LOOK_CHATS);

  for (const chat of publicChats) {
    chat.element.dataset.hasSeenByModekun = "1";
  }
  hideRepeatThrow(publicChats);
  hideNgWords(publicChats);
  hideRepeatWords(kuromojiWorkerApi, publicChats);
};

const hide = (chat: Chat) => {
  if (!chat.element.dataset.isHiddenByModekun) {
    console.log(`hide ${chat.author} ${chat.message}`);

    chat.element.style.display = "none";
    chat.element.dataset.isHiddenByModekun = "1";
  }
};
