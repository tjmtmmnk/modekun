import { IChat } from "./chat";
import { IKuromojiWorker } from "./kuromoji.worker";
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

export const hidePostFlood = (param: IParameter, chats: IChat[]) => {
  const authorCount: { [author: string]: number } = {};
  const authorToChats: { [author: string]: IChat[] } = {};

  for (const chat of chats) {
    if (!authorCount[chat.author]) {
      authorCount[chat.author] = 1;
    } else {
      authorCount[chat.author]++;
    }
    if (!authorToChats[chat.author]) {
      authorToChats[chat.author] = [chat];
    } else {
      authorToChats[chat.author].push(chat);
    }
  }

  for (const [author, count] of Object.entries(authorCount)) {
    if (count >= param.post_flood_threshold) {
      for (const c of authorToChats[author]) {
        hide("投稿頻度", c);
      }
    }
  }
};

export const hideByLength = (params: IParameter, chats: IChat[]) => {
  for (const chat of chats) {
    if (chat.message.length >= params.length_threshold) {
      hide("文字数制限", chat);
    }
  }
};

export const moderate = async (
  kuromojiWorkerApi: IKuromojiWorker,
  param: IParameter,
  chats: IChat[]
): Promise<void> => {
  const publicChats = chats.filter(
    (chat) => !chat.element.dataset.isHiddenByModekun
  );

  hideRepeatWords(param, kuromojiWorkerApi, publicChats);
  hidePostFlood(param, publicChats);
  hideRepeatThrow(param, publicChats);
  hideNgWords(param, publicChats);
  hideByLength(param, publicChats);
};

const hide = (reason: string, chat: IChat) => {
  if (!chat.element.dataset.isHiddenByModekun) {
    chat.element.style.opacity = "0";
    chat.element.dataset.isHiddenByModekun = "1";

    const reasonLabel = document.createElement("span");
    reasonLabel.innerText = reason;
    reasonLabel.style.color = "grey";
    reasonLabel.style.position = "absolute";
    reasonLabel.style.left = "50%";
    chat.element.insertAdjacentElement("beforebegin", reasonLabel);

    chat.element.addEventListener("mouseenter", () => {
      chat.element.style.opacity = "1";
      reasonLabel.style.display = "none";
    });
    chat.element.addEventListener("mouseleave", () => {
      chat.element.style.opacity = "0";
      reasonLabel.style.display = "inline";
    });
  }
};
