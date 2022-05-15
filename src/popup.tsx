import React, { useEffect, useReducer } from "react";
import ReactDOM from "react-dom";
import PopupPage from "./components/popup";

import {
  defaultParamsV2,
  DEFAULT_IS_USE_SAME_PARAM,
  IParameterV2,
} from "./config";
import { Message, sendRequestToContent } from "./message";

export interface IPopupState {
  param: IParameterV2;
  isUseSameParam: boolean;
  isLoading: boolean;
}
type Action =
  | { t: "update"; param: IParameterV2 }
  | { t: "loaded" }
  | { t: "update-is-use-same-param"; isUseSameParam: boolean };

export type PopupDispatch = (a: Action) => void;

const reducer = (state: IPopupState, action: Action) => {
  if (action.t === "update") {
    return { ...state, param: action.param };
  } else if (action.t === "loaded") {
    return { ...state, isLoading: false };
  } else if (action.t === "update-is-use-same-param") {
    return { ...state, isUseSameParam: action.isUseSameParam };
  }
  return state;
};

const initialState: IPopupState = {
  param: defaultParamsV2,
  isUseSameParam: DEFAULT_IS_USE_SAME_PARAM,
  isLoading: true,
};

export const updateParam = async (param: IParameterV2) => {
  await sendRequestToContent({
    type: "UPDATE_PARAM",
    from: "POPUP",
    to: "CONTENT_SCRIPT",
    data: { param },
  });
};

export const updateIsUseSameParam = async (isUseSameParam: boolean) => {
  console.log(`UPDATE is use same param from popup: ${isUseSameParam}`);
  await sendRequestToContent({
    type: "UPDATE_IS_USE_SAME_PARAM",
    from: "POPUP",
    to: "CONTENT_SCRIPT",
    data: { isUseSameParam },
  });
};

export const reloadNotification = async () => {
  console.log("RELOAD from popup");
  await sendRequestToContent({
    type: "RELOAD",
    from: "POPUP",
    to: "CONTENT_SCRIPT",
  });
};

const Popup = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    chrome.runtime.onMessage.addListener(
      (req: Message, sender, sendResponse) => {
        if (req.from === "POPUP" || req.to !== "POPUP") {
          sendResponse();
          return;
        }
        if (req.type === "UPDATE_PARAM") {
          if (!req.data || !req.data.param) throw new Error("no param");
          dispatch({ t: "update", param: req.data.param as IParameterV2 });
          dispatch({ t: "loaded" });
        }
        if (req.type === "UPDATE_IS_USE_SAME_PARAM") {
          if (!req.data || req.data.isUseSameParam === undefined)
            throw new Error("no isUseSameParam");
          dispatch({
            t: "update-is-use-same-param",
            isUseSameParam: req.data.isUseSameParam as boolean,
          });
        }
        sendResponse();
      }
    );
    sendRequestToContent({
      type: "GET_PARAM",
      from: "POPUP",
      to: "CONTENT_SCRIPT",
    });
  }, [dispatch]);

  return <PopupPage state={state} dispatch={dispatch} />;
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
