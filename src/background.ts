import { Message } from "./message";
import { KEY_MODEKUN_PARAM } from "./config";
import { get, set } from "./storage";

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === "modekun");
  port.onMessage.addListener(async (req: Message) => {
    switch (req.type) {
      case "UPDATE_PARAM": {
        if (!req?.data?.param) return;
        const paramKey = await get<string | undefined>(KEY_MODEKUN_PARAM);
        paramKey && (await set(paramKey, req.data.param));
      }
    }
  });
});
