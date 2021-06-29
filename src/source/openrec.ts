import { ISource } from "./source";
import { IChat } from "../chat";
import { kanaToHiragana, removeSymbols } from "../util";

const chatSelector = {
  section: ".page-wrapper",
};

const chatRegex = {
  chatBlock: /ChatCell__Box-.*/,
  message: /ChatCell__InlineMessage-.*/,
  author: /UserName__Wrapper-.*/,
};

// each class name has random value which may be changed by release.
export const Openrec: ISource = {
  extractChats(lookNum: number): IChat[] {
    const section = document.querySelector<HTMLElement>(chatSelector.section);
    if (!section) return [];

    const blocks = section.querySelectorAll<HTMLElement>("*");
    const chatBlocks: HTMLElement[] = [];
    for (const block of blocks) {
      if (chatRegex.chatBlock.test(block.className)) {
        chatBlocks.push(block);
      }
    }
    const chats: IChat[] = [];
    for (const chatBlock of chatBlocks) {
      const elements = chatBlock.querySelectorAll<HTMLElement>("*");
      let author, message;
      for (const element of elements) {
        if (chatRegex.author.test(element.className)) {
          author = element.innerText;
        }
        if (chatRegex.message.test(element.className)) {
          message = element.innerText;
        }
        if (author && message) break;
      }

      if (!author || !message) continue;

      if (chats.length < lookNum) {
        const key = removeSymbols(kanaToHiragana(author + message));
        chats.push({
          key: key,
          author: author,
          message: message,
          element: chatBlock,
        });
      }
    }
    return chats;
  },
};
