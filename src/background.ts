import { Message, sendRequest, sendRequestToContent } from "./message";
import {
  defaultParamsV2,
  DEFAULT_IS_USE_SAME_PARAM,
  IParameterV2,
  keyIsUseSameParam,
} from "./config";
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
      console.log("update param");
      const key: string = req.data.key;
      const param: IParameterV2 = req.data.param;
      try {
        await set<IParameterV2>(key, param);
      } catch (e) {
        console.error(e);
      }
    } else if (
      req.type === "GET_IS_USE_SAME_PARAM" &&
      req.from === "CONTENT_SCRIPT"
    ) {
      console.log(`GET is use same param from content script`);
      const isUseSameParam =
        (await get<boolean | undefined>(keyIsUseSameParam)) ??
        DEFAULT_IS_USE_SAME_PARAM;
      await sendRequestToContent({
        type: "UPDATE_IS_USE_SAME_PARAM",
        from: "BACKGROUND",
        to: "CONTENT_SCRIPT",
        data: { isUseSameParam },
      });
      await sendRequest({
        type: "UPDATE_IS_USE_SAME_PARAM",
        from: "BACKGROUND",
        to: "POPUP",
        data: { isUseSameParam },
      });
    } else if (
      req.type === "UPDATE_IS_USE_SAME_PARAM" &&
      req.from === "CONTENT_SCRIPT"
    ) {
      if (!req.data) throw new Error("no data");
      if (req.data.isUseSameParam === undefined)
        throw new Error("no isUseSameParam");

      const isUseSameParam: boolean = req.data.isUseSameParam;
      console.log(
        `UPDATE is use same param from content script: ${isUseSameParam}`
      );
      try {
        await set<boolean>(keyIsUseSameParam, isUseSameParam);
      } catch (e) {
        console.error(e);
      }
    }
    sendResponse();
  }
);
