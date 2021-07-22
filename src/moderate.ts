import { IChat } from "./chat";
import { wrap } from "comlink";
import { IParameter } from "./config";
import { IKuromojiWorker } from "./kuromoji";

export const createKuromojiWorker = async (): Promise<Worker> => {
  const worker = await fetch(chrome.extension.getURL("js/worker.js"));
  const js = await worker.text();
  const blob = new Blob([js], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);

  return new Worker(url);
};

export const createKuromojiWorkerApi = async (
  worker: Worker,
  dicPath: string
): Promise<IKuromojiWorker> => {
  const workerClass: any = wrap<IKuromojiWorker>(worker);
  const instance = await new workerClass(dicPath);
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
      hide(param, chrome.i18n.getMessage("repeatPost"), chat);
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
        hide(param, chrome.i18n.getMessage("ngWord"), chat);
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
      hide(param, chrome.i18n.getMessage("repeatWords"), chat);
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
        hide(param, chrome.i18n.getMessage("repeatFrequency"), c);
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
      hide(param, chrome.i18n.getMessage("maxNumOfCharacters"), chat);
    }
  }
};

export const moderate = async (
  kuromojiWorkerApi: IKuromojiWorker,
  param: IParameter,
  chats: IChat[]
): Promise<void> => {
  hideByLength(param, chats);
  hideNgWords(param, chats);
  hideRepeatWords(param, kuromojiWorkerApi, chats);
  hideRepeatThrow(param, chats);
  hidePostFlood(param, chats);
};

export const hide = (param: IParameter, reason: string, chat: IChat) => {
  if (chat.element.dataset.isHiddenByModekun) return;

  chat.element.dataset.isHiddenByModekun = "1";

  if (param.is_hide_completely) {
    chat.element.style.display = "none";
    if (chat.associatedElements) {
      for (const element of chat.associatedElements) {
        element.style.display = "none";
      }
    }
  } else {
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
  }
};
