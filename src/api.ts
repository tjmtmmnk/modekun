import { defaultParamsV2, IParameterV2 } from "./config";
import {
  NetworkNode,
  receiveRequest,
  sendRequest,
  sendRequestToContent,
} from "./message";

export const getParam = async (from: NetworkNode): Promise<IParameterV2> => {
  if (from === "POPUP") {
    sendRequestToContent({
      type: "UPDATE_PARAM_KEY",
      from: from,
      to: "CONTENT_SCRIPT",
    });
  }
  sendRequest({
    type: "GET_PARAM",
    from: from,
    to: "BACKGROUND",
  });
  const res = await receiveRequest("RECEIVE_PARAM");
  return res.data?.param ?? defaultParamsV2;
};
