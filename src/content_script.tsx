import { Chat } from "./chat";
import { moderate } from "./moderate";
import { kanaToHiragana, removeSymbols } from "./util";
import * as comlink from "comlink";
import { KuromojiWorker } from "./kuromoji.worker";

async function createInstance(): Promise<KuromojiWorker> {
  console.time("load");
  const worker = await fetch(chrome.extension.getURL("js/worker.js"));
  const js = await worker.text();
  const blob = new Blob([js], { type: "text/javascript" });
  const url = URL.createObjectURL(blob);
  const workerClass: any = comlink.wrap<KuromojiWorker>(new Worker(url));
  const instance = await new workerClass(chrome.extension.getURL("kuromoji/dict/"));
  console.timeEnd("load");
  return instance;
}

window.addEventListener("load", async () => {
  console.time("do something");
  const instance = await createInstance();
  const counts = await instance.getMaxRepeatWordCounts(["吾輩は猫である", "名前はまだない", "こんにちは", "最強最強"]);
  console.log(counts);
  console.timeEnd("do something");
  // const modekun = () => {
  //   const chatSection = document.querySelector<HTMLIFrameElement>("iframe");
  //   if (!chatSection || !chatSection.contentWindow) return;
  //   console.log("hello modekun");
  //
  //   const chatBlocks = chatSection.contentWindow.document.querySelectorAll<HTMLElement>(
  //     ".yt-live-chat-text-message-renderer"
  //   );
  //   const chats: Chat[] = [];
  //   chatBlocks.forEach((chatBlock) => {
  //     const messageElement = chatBlock.querySelector<HTMLElement>("#message");
  //     if (!messageElement) return;
  //     const authorElement = chatBlock.querySelector<HTMLElement>(
  //       "#author-name"
  //     );
  //     const author = authorElement?.innerText;
  //     const message = messageElement.innerText;
  //     const key = removeSymbols(kanaToHiragana(author + message));
  //     chats.push({
  //       key: key,
  //       author: author,
  //       message: message,
  //       element: chatBlock,
  //     });
  //   });
  //   moderate(chats);
  // };
  // window.setInterval(modekun, 5000);
});
