export type MessageType =
  | "UPDATE_PARAM"
  | "GET_PARAM"
  | "GET_IS_USE_SAME_PARAM"
  | "UPDATE_IS_USE_SAME_PARAM";

export type NetworkNode = "CONTENT_SCRIPT" | "BACKGROUND" | "POPUP";

export interface Message {
  type: MessageType;
  from: NetworkNode;
  to: NetworkNode;
  data?: any;
}

export const sendRequest = async <R>(req: Message): Promise<R> => {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(req, (res) => {
      let err = chrome.runtime.lastError;
      if (
        !err ||
        (err.message && /The message port closed before/.test(err.message))
      ) {
        resolve(res);
      } else {
        err = new Error(err.message);
        reject(err);
      }
    });
  });
};

export const sendRequestToContent = async (req: Message) => {
  if (req.to !== "CONTENT_SCRIPT")
    throw new Error("must send to CONTENT_SCRIPT");
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });

  return new Promise((resolve, reject) => {
    if (tabs.length === 0 || !tabs[0].id) {
      reject(Error("no tab"));
      return;
    }
    chrome.tabs.sendMessage(tabs[0].id, req, (res) => {
      let err = chrome.runtime.lastError;
      if (
        !err ||
        (err.message && /The message port closed before/.test(err.message))
      ) {
        resolve(res);
      } else {
        err = new Error(err.message);
        reject(err);
      }
    });
  });
};
