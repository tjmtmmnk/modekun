import { defaultParamsV2, IParameterV2 } from "./config";
import {
  NetworkNode,
  receiveRequest,
  sendRequest,
  sendRequestToContent,
} from "./message";

const sleep = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getParam = async (from: NetworkNode): Promise<IParameterV2> => {
  if (from === "POPUP") {
    sendRequestToContent({
      type: "UPDATE_PARAM_KEY",
      from: from,
      to: "CONTENT_SCRIPT",
    });
  }

  /* XXX: assure order
  1. update param key
  2. get param by using updated param key
   */
  await sleep(500);

  sendRequest({
    type: "GET_PARAM",
    from: from,
    to: "BACKGROUND",
  });
  const res = await receiveRequest("RECEIVE_PARAM");
  return res.data?.param ?? defaultParamsV2;
};
