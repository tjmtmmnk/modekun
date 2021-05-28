import React from "react";
import ReactDOM from "react-dom";
import PopupPage from "./components/popup";

import {
  paramKeys,
  defaultParams,
  isParameter,
  IParameter,
  serializedParams,
} from "./config";

import { getItems } from "./storage";

export const useParams = (): IParameter | undefined => {
  const [params, setParams] = React.useState<IParameter>();
  let isMounted = true;
  React.useEffect(() => {
    getItems(paramKeys())
      .then((p) => {
        if (isMounted) {
          if (isParameter(p)) {
            setParams(p);
          } else {
            setParams(defaultParams);
            chrome.storage.sync.set(serializedParams(defaultParams));
          }
        }
      })
      .catch((e) => console.log(e));
    return () => {
      isMounted = false;
    };
  });
  return params;
};

const Popup = () => {
  const params = useParams();
  return <>{params && <PopupPage params={params} />}</>;
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
