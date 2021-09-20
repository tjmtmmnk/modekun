import { Message, sendRequest } from "./message";
import { defaultParamsV2, IParameterV2 } from "./config";
import { get, set } from "./storage";

const KEY_MODEKUN_PARAM = "modekun_parameter_key";

chrome.runtime.onConnect.addListener((port) => {
  console.assert(port.name === "modekun");
  port.onMessage.addListener(async (req: Message) => {
    switch (req.type) {
      case "UPDATE_PARAM": {
        if (!req?.data?.param) return;
        const paramKey = await get<string | undefined>(KEY_MODEKUN_PARAM);
        paramKey && (await set(paramKey, req.data.param));
      }
      case "UPDATE_PARAM_KEY": {
        if (!req?.data?.key) return;
        await set<string>(KEY_MODEKUN_PARAM, req.data.key);
      }
      case "GET_PARAM": {
        const paramKey = await get<string | undefined>(KEY_MODEKUN_PARAM);
        const param = paramKey
          ? (await get<IParameterV2 | undefined>(paramKey)) ?? defaultParamsV2
          : defaultParamsV2;

        const res: Message = {
          type: "RECEIVE_PARAM",
          data: {
            param: param,
          },
        };
        port.postMessage(res);
      }
    }
  });
});
