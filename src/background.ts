import { Message, sendRequest } from "./message";
import { defaultParamsV2, IParameterV2 } from "./config";
import { get, set } from "./storage";

const KEY_MODEKUN_PARAM = "modekun_parameter_key";

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === "modekun");
  port.onMessage.addListener(async (req: Message) => {
    if (req.from === "BACKGROUND" || req.to !== "BACKGROUND") return;
    switch (req.type) {
      case "UPDATE_PARAM": {
        if (req.from === "CONTENT_SCRIPT") return;
        console.log("update param!!");
        if (!req?.data?.param) return;
        const paramKey = await get<string | undefined>(KEY_MODEKUN_PARAM);
        paramKey && (await set(paramKey, req.data.param));
        break;
      }
      case "UPDATE_PARAM_KEY": {
        if (req.from === "POPUP") return;
        console.log("update param key!");
        if (!req?.data?.key) return;
        await set<string>(KEY_MODEKUN_PARAM, req.data.key);
        break;
      }
      case "GET_PARAM": {
        const paramKey = await get<string | undefined>(KEY_MODEKUN_PARAM);
        console.log("get param!");
        console.log(paramKey);
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
