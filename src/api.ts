import { defaultParamsV2, IParameterV2 } from "./config";
import { receiveRequest, sendRequest } from "./message";

export const getParam = async (): Promise<IParameterV2> => {
  sendRequest({
    type: "GET_PARAM",
  });
  const res = await receiveRequest("RECEIVE_PARAM");
  return res.data?.param ?? defaultParamsV2;
};
