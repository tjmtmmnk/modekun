export type MessageType = "UPDATE_PARAM" | "GET_PARAM";

export type NetworkNode = "CONTENT_SCRIPT" | "BACKGROUND" | "POPUP";

export interface Message {
  type: MessageType;
  from: NetworkNode;
  to: NetworkNode;
  data?: any;
}

export const sendRequest = <T = any>(
  req: Message,
  resFn?: (res: T) => void
) => {
  chrome.runtime.sendMessage(req, resFn);
};

export const sendRequestToContent = <T = any>(
  req: Message,
  resFn?: (res: T) => void
) => {
  if (req.to !== "CONTENT_SCRIPT") return;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    tabs[0].id && chrome.tabs.sendMessage(tabs[0].id, req);
  });
};
