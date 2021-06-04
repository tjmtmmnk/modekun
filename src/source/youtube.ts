import { IChat } from "../chat";
import { kanaToHiragana, removeSymbols } from "../util";
import { ISource } from "./source";

const chatSelector = {
  chatSection: "#chatframe",
  chatBlock: ".yt-live-chat-text-message-renderer",
  message: "#message",
  author: "#author-name",
};

export const Youtube: ISource = {
  extractChats(): IChat[] {
    const chatSection = document.querySelector<HTMLIFrameElement>(
      chatSelector.chatSection
    );
    if (!chatSection || !chatSection.contentWindow) return [];

    const chatBlocks = chatSection.contentWindow.document.querySelectorAll<HTMLElement>(
      chatSelector.chatBlock
    );
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

      const author = authorElement.innerText;
      const message = messageElement.innerText;
      const key = removeSymbols(kanaToHiragana(author + message));
      chats.push({
        key: key,
        author: author,
        message: message,
        element: chatBlock,
      });
    });
    return chats;
  },
};
