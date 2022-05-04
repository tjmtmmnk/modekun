import React, { useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import PopupPage from "./components/popup";

import { defaultParamsV2, IParameterV2 } from "./config";
import { Message, sendRequestToContent } from "./message";

export interface IPopupState {
  param: IParameterV2;
  isLoading: boolean;
}
type Action = { t: "update"; param: IParameterV2 } | { t: "loaded" };

export type PopupDispatch = (a: Action) => void;

const reducer = (state: IPopupState, action: Action) => {
  if (action.t === "update") {
    return { ...state, param: action.param };
  } else if (action.t === "loaded") {
    return { ...state, isLoading: false };
  }
  return state;
};

const initialState: IPopupState = {
  param: defaultParamsV2,
  isLoading: true,
};

const Popup = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (req: Message, sender, sendResponse) => {
        if (req.from === "POPUP" || req.to !== "POPUP") return;
        if (req.type === "UPDATE_PARAM") {
          if (!req.data || !req.data.param) throw new Error("no param");
          dispatch({ t: "update", param: req.data.param as IParameterV2 });
          dispatch({ t: "loaded" });
        }
      }
    );
  }, [dispatch]);
  useEffect(() => {
    console.log("send req to content");
    sendRequestToContent({
      type: "UPDATE_PARAM",
      from: "POPUP",
      to: "CONTENT_SCRIPT",
      data: { param: state.param },
    });
  }, [state.param]);

  console.log(state);

  return <PopupPage state={state} dispatch={dispatch} />;
};

sendRequestToContent({
  type: "GET_PARAM",
  from: "POPUP",
  to: "CONTENT_SCRIPT",
});

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
