export type MessageType = "UPDATE_PARAM";

export interface Message {
  type: MessageType;
  data?: any;
}

const port = chrome.runtime.connect({ name: "modekun" });
export const sendRequest = (req: Message) => {
  port.postMessage(req);
};
