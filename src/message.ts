import { getCurrentTab } from "./tabs";

export type MessageType =
  | "UPDATE_PARAM"
  | "UPDATE_PARAM_KEY"
  | "GET_PARAM"
  | "RECEIVE_PARAM";

export type NetworkNode = "CONTENT_SCRIPT" | "BACKGROUND" | "POPUP";

export interface Message {
  type: MessageType;
  from: NetworkNode;
  to: NetworkNode;
  data?: any;
}

const port = chrome.runtime.connect({ name: "modekun" });
let popupPort: chrome.runtime.Port | undefined;
getCurrentTab().then((tab) => {
  if (tab.id) {
    popupPort = chrome.tabs.connect(tab.id);
  }
});

export const sendRequest = (req: Message) => {
  port.postMessage(req);
};

export const sendRequestToContent = (req: Message) => {
  if (req.to !== "CONTENT_SCRIPT") return;
  popupPort && popupPort.postMessage(req);
};

export const receiveRequest = (type: MessageType): Promise<Message> => {
  return new Promise((resolve) => {
    port.onMessage.addListener((req: Message, reqPort) => {
      console.assert(port.name === reqPort.name);
      if (req.type === type) {
        resolve(req);
      }
    });
  });
};
