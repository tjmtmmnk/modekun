import { Chat } from "./chat";

const REPEAT_THRESHOLD = 2;
const LOOK_CHATS = 50;
const NG_WORDS = ["あ"];

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

export const moderate = (chats: Chat[]) => {
  const publicChats = chats
    .filter((chat) => !chat.element.dataset.isHiddenByModekun)
    .slice(-LOOK_CHATS);
  hideRepeatThrow(publicChats);
  hideNgWords(publicChats);
};

const hide = (chat: Chat) => {
  if (!chat.element.dataset.isHiddenByModekun) {
    console.log(`hide ${chat.author} ${chat.message}`);

    chat.element.style.display = "none";
    chat.element.dataset.isHiddenByModekun = "1";
  }
};
