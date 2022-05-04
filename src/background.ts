import { Message, sendRequestToContent } from "./message";
import { defaultParamsV2, IParameterV2 } from "./config";
import { get, set } from "./storage";

chrome.runtime.onMessage.addListener(
  async (req: Message, sender, sendResponse) => {
    if (req.from === "BACKGROUND" || req.to !== "BACKGROUND") return;
    if (req.type === "GET_PARAM") {
      if (!req.data) return;
      const key: string = req.data.key;
      if (!key) throw new Error("no key");
      let param: IParameterV2;
      try {
        const _param = await get<IParameterV2 | undefined>(key);
        console.log(_param);
        param = _param ?? defaultParamsV2;
        if (!_param) {
          await set<IParameterV2>(key, defaultParamsV2);
        }
      } catch (e) {
        console.error(e);
        param = defaultParamsV2;
      }
      sendRequestToContent({
        type: "UPDATE_PARAM",
        from: "BACKGROUND",
        to: "CONTENT_SCRIPT",
        data: { param },
      });
    } else if (req.type === "UPDATE_PARAM" && req.from === "POPUP") {
    }
  }
);
