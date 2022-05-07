import { Message, sendRequest, sendRequestToContent } from "./message";
import { defaultParamsV2, IParameterV2 } from "./config";
import { get, set } from "./storage";

chrome.runtime.onMessage.addListener(
  async (req: Message, sender, sendResponse) => {
    if (req.from === "BACKGROUND" || req.to !== "BACKGROUND") {
      sendResponse();
      return;
    }
    if (req.type === "GET_PARAM" && req.from === "CONTENT_SCRIPT") {
      if (!req.data) throw new Error("no data");
      if (!req.data.key) throw new Error("no key");
      const key: string = req.data.key;
      let param: IParameterV2;
      try {
        const _param = await get<IParameterV2 | undefined>(key);
        param = _param ?? defaultParamsV2;
        if (!_param) {
          await set<IParameterV2>(key, defaultParamsV2);
        }
      } catch (e) {
        console.error(e);
        param = defaultParamsV2;
      }
      await sendRequestToContent({
        type: "UPDATE_PARAM",
        from: "BACKGROUND",
        to: "CONTENT_SCRIPT",
        data: { param },
      });
      await sendRequest({
        type: "UPDATE_PARAM",
        from: "BACKGROUND",
        to: "POPUP",
        data: { param },
      });
    } else if (req.type === "UPDATE_PARAM" && req.from === "CONTENT_SCRIPT") {
      if (!req.data) throw new Error("no data");
      if (!req.data.key) throw new Error("no key");
      if (!req.data.param) throw new Error("no param");
      const key: string = req.data.key;
      const param: IParameterV2 = req.data.param;
      try {
        await set<IParameterV2>(key, param);
      } catch (e) {
        console.error(e);
      }
    }
    sendResponse();
  }
);
