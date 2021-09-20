import React from "react";
import ReactDOM from "react-dom";
import PopupPage from "./components/popup";

import { defaultParamsV2, IParameterV2 } from "./config";
import { receiveRequest, sendRequest } from "./message";

export const useParams = (): IParameterV2 | undefined => {
  const [params, setParams] = React.useState<IParameterV2>();
  let isMounted = true;
  React.useEffect(() => {
    sendRequest({
      type: "GET_PARAM",
    });
    receiveRequest("RECEIVE_PARAM").then((res) => {
      const param = res.data?.param as IParameterV2;
      console.log("receive!!!!!!!");
      console.log(param);
      if (isMounted) {
        setParams(param ?? defaultParamsV2);
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  return params;
};

const Popup = () => {
  return <PopupPage />;
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
