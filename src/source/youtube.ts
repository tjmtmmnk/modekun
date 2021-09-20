import { IChat } from "../chat";
import { kanaToHiragana, removeSymbols } from "../util";
import { ISource } from "./source";
import { Streamer } from "../streamer";

const chatSelector = {
  chatSection: "#chatframe",
  chatBlock: "#content",
  message: "#message",
  author: "#author-name",
};

const streamerSelector = {
  section: "#upload-info",
  block: "#channel-name",
  streamer: ".yt-simple-endpoint",
};

export const Youtube: ISource = {
  name: "youtube",
  extractChats(lookNum: number): IChat[] {
    const chatSection = document.querySelector<HTMLIFrameElement>(
      chatSelector.chatSection
    );
    if (!chatSection || !chatSection.contentWindow) return [];

    const chatBlocks = [
      ...chatSection.contentWindow.document.querySelectorAll<HTMLElement>(
        chatSelector.chatBlock
      ),
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

      const author = authorElement.innerText;
      const message = messageElement.innerText;
      const key = removeSymbols(kanaToHiragana(author + message));
      chats.push({
        key: key,
        author: author,
        message: message,
        element: chatBlock,
        associatedElements: chatBlock.parentElement
          ? [chatBlock.parentElement]
          : [],
      });
    });
    return chats;
  },
  extractStreamer() {
    const section = document.querySelector<HTMLElement>(
      streamerSelector.section
    );
    const block = section?.querySelector<HTMLElement>(streamerSelector.block);
    const streamer = block?.querySelector<HTMLElement>(
      streamerSelector.streamer
    );
    const streamerName = streamer?.innerText ?? "NONE";

    return {
      name: streamerName,
    };
  },
};
