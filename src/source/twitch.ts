import { ISource } from "./source";
import { IChat } from "../chat";
import { kanaToHiragana, removeSymbols } from "../util";

const chatSelector = {
  chatBlock: ".chat-line__message-container",
  message: ".text-fragment",
  author: ".chat-author__display-name",
};

export const Twitch: ISource = {
  extractChats(lookNum: number): IChat[] {
    const chatBlocks = [
      ...document.querySelectorAll<HTMLElement>(chatSelector.chatBlock),
    ].slice(-lookNum);

    const chats: IChat[] = [];
    chatBlocks.forEach((chatBlock) => {
      const messageElement = chatBlock.querySelector<HTMLElement>(
        chatSelector.message
      );
      if (!messageElement) return;

      const authorElement = chatBlock.querySelector<HTMLElement>(
        chatSelector.author
      );
      if (!authorElement) return;

      const associatedElements: HTMLElement[] = [];

      const parentElement = chatBlock.parentElement;
      parentElement && associatedElements.push(parentElement);

      const grandParentElement = parentElement?.parentElement;
      grandParentElement && associatedElements.push(grandParentElement);

      const author = authorElement.innerText;
      const message = messageElement.innerText;
      const key = removeSymbols(kanaToHiragana(author + message));
      chats.push({
        key: key,
        author: author,
        message: message,
        element: chatBlock,
        associatedElements: associatedElements,
      });
    });

    return chats;
  },
};
