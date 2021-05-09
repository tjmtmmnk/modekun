import { Chat } from "./chat";

const REPEAT_THRESHOLD = 0;
const LOOK_CHATS = 50;

const hideRepeatThrow = (chats: Chat[]) => {
  const duplicateCount: { [key: string]: number } = {};
  for (const chat of chats) {
    if (!duplicateCount[chat.key]) {
      duplicateCount[chat.key] = 0;
    }
    duplicateCount[chat.key]++;
  }
  console.log(duplicateCount);
  for (const chat of chats) {
    if (duplicateCount[chat.key] > REPEAT_THRESHOLD) {
      console.log(`hide ${chat.author} ${chat.message}`);
      hide(chat);
    }
  }
};

export const moderate = (chats: Chat[]) => {
  const publicChats = chats
    .filter((chat) => !chat.element.dataset.isHiddenByModekun)
    .slice(-LOOK_CHATS);
  hideRepeatThrow(publicChats);
};

const hide = (chat: Chat) => {
  chat.element.style.display = "none";
  chat.element.dataset.isHiddenByModekun = "1";
};
