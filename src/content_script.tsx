import { Chat } from "./chat";
import { moderate } from "./moderate";
import { kanaToHiragana, removeSymbols } from "./util";

window.addEventListener("load", async () => {
  const modekun = () => {
    const chatSection = document.querySelector<HTMLIFrameElement>("iframe");
    if (!chatSection || !chatSection.contentWindow) return;
    console.log("hello modekun");

    const chatBlocks = chatSection.contentWindow.document.querySelectorAll<HTMLElement>(
      ".yt-live-chat-text-message-renderer"
    );
    const chats: Chat[] = [];
    chatBlocks.forEach((chatBlock) => {
      const messageElement = chatBlock.querySelector<HTMLElement>("#message");
      if (!messageElement) return;
      const authorElement = chatBlock.querySelector<HTMLElement>(
        "#author-name"
      );
      const author = authorElement?.innerText;
      const message = messageElement.innerText;
      const key = removeSymbols(kanaToHiragana(author + message));
      chats.push({
        key: key,
        author: author,
        message: message,
        element: chatBlock,
      });
    });
    moderate(chats);
  };
  window.setInterval(modekun, 5000);
});
