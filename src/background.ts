import { Message } from "./message";
import { defaultParamsV2, IParameterV2 } from "./config";
import { get, set } from "./storage";

let paramKey: string;

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === "modekun");
  port.onMessage.addListener(async (req: Message) => {
    if (req.from === "BACKGROUND" || req.to !== "BACKGROUND") return;
    switch (req.type) {
      case "UPDATE_PARAM": {
        if (req.from === "CONTENT_SCRIPT") return;
        if (!req?.data?.param) return;
        paramKey && (await set(paramKey, req.data.param));
        break;
      }
      case "UPDATE_PARAM_KEY": {
        if (req.from === "POPUP") return;
        if (!req?.data?.key) return;
        paramKey = req.data.key;
        break;
      }
      case "GET_PARAM": {
        const param = paramKey
          ? (await get<IParameterV2 | undefined>(paramKey)) ?? defaultParamsV2
          : defaultParamsV2;

        const res: Message = {
          type: "RECEIVE_PARAM",
          from: "BACKGROUND",
          to: "POPUP",
          data: {
            param: param,
          },
        };
        port.postMessage(res);
        break;
      }
    }
  });
});
