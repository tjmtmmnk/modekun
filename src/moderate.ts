import { Chat } from "./chat";
import * as kuromoji from "kuromoji";

const REPEAT_THRESHOLD = 2;
const LOOK_CHATS = 50;
const NG_WORDS = ["なう", "偽物"];

const builder = kuromoji.builder({
  dicPath: chrome.extension.getURL("kuromoji/dict/"),
});

const hideRepeatThrow = (chats: Chat[]) => {
  const duplicateCount: { [key: string]: number } = {};
  for (const chat of chats) {
    if (!duplicateCount[chat.key]) {
      duplicateCount[chat.key] = 0;
    }
    duplicateCount[chat.key]++;
  }
  for (const chat of chats) {
    if (duplicateCount[chat.key] >= REPEAT_THRESHOLD) {
      hide(chat);
    }
  }
};

const hideNgWords = (chats: Chat[]) => {
  for (const chat of chats) {
    for (const ngWord of NG_WORDS) {
      if (chat.message.includes(ngWord)) {
        hide(chat);
      }
    }
  }
};

const hideRepeatWords = (chats: Chat[]) => {
  for (const chat of chats.slice(-10)) {
    console.log(chat.message);
    builder.build((err, tokenizer) => {
      if (err) return;
      const tokens = tokenizer.tokenize(chat.message);
      const tokenArr = tokens.map((token: any) => {
        return token;
      });
      console.dir(tokenArr);
    });
  }
};

export const moderate = (chats: Chat[]) => {
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
  hideRepeatWords(publicChats);
};

const hide = (chat: Chat) => {
  if (!chat.element.dataset.isHiddenByModekun) {
    console.log(`hide ${chat.author} ${chat.message}`);

    chat.element.style.display = "none";
    chat.element.dataset.isHiddenByModekun = "1";
  }
};
