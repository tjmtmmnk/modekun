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
      hide(param, "連投", chat);
    }
  }
};

export const hideNgWords = (param: IParameter, chats: IChat[]) => {
  for (const chat of chats) {
    for (const ngWord of param.ng_words) {
      const isHideMessage = chat.message.includes(ngWord);
      const isHideAuthor =
        param.consider_author_ngword && chat.author.includes(ngWord);

      if (isHideMessage || isHideAuthor) {
        hide(param, "NGワード", chat);
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
      hide(param, "単語繰り返し", chat);
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
        hide(param, "投稿頻度", c);
      }
    }
  }
};

export const hideByLength = (param: IParameter, chats: IChat[]) => {
  for (const chat of chats) {
    const isHideMessage = chat.message.length >= param.length_threshold;
    const isHideAuthor =
      param.consider_author_length &&
      chat.author.length >= param.length_threshold;

    if (isHideMessage || isHideAuthor) {
      hide(param, "文字数制限", chat);
    }
  }
};

export const moderate = async (
  kuromojiWorkerApi: IKuromojiWorker,
  param: IParameter,
  chats: IChat[]
): Promise<void> => {
  hideRepeatWords(param, kuromojiWorkerApi, chats);
  hidePostFlood(param, chats);
  hideRepeatThrow(param, chats);
  hideNgWords(param, chats);
  hideByLength(param, chats);
};

const hide = (param: IParameter, reason: string, chat: IChat) => {
  chat.element.style.opacity = "0";

  const reasonLabel = param.is_show_reason
    ? document.createElement("span")
    : null;
  if (reasonLabel) {
    reasonLabel.innerText = reason;
    reasonLabel.style.color = "grey";
    reasonLabel.style.position = "absolute";
    reasonLabel.style.left = "50%";
    chat.element.insertAdjacentElement("beforebegin", reasonLabel);
  }

  chat.element.addEventListener("mouseenter", () => {
    chat.element.style.opacity = "1";
    if (reasonLabel) reasonLabel.style.display = "none";
  });
  chat.element.addEventListener("mouseleave", () => {
    chat.element.style.opacity = "0";
    if (reasonLabel) reasonLabel.style.display = "inline";
  });
};
