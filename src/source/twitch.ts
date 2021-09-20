import { ISource } from "./source";
import { IChat } from "../chat";
import { kanaToHiragana, removeSymbols } from "../util";
import { Streamer } from "../streamer";

const chatSelector = {
  chatBlock: ".chat-line__message-container",
  message: ".text-fragment",
  author: ".chat-author__display-name",
};

const streamerSelector = {
  block: ".channel-info-content",
  streamer: ".tw-title",
};

export const Twitch: ISource = {
  name: "twitch",
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
  extractStreamer() {
    const block = document.querySelector<HTMLElement>(streamerSelector.block);
    const streamer = block?.querySelector<HTMLElement>(
      streamerSelector.streamer
    );
    const streamerName = streamer?.innerText ?? "NONE";
    return {
      name: streamerName,
    };
  },
};
