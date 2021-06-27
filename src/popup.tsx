import React from "react";
import ReactDOM from "react-dom";
import PopupPage from "./components/popup";

import { defaultParams, isParameter, IParameter, getParams } from "./config";

export const useParams = (): IParameter | undefined => {
  const [params, setParams] = React.useState<IParameter>();
  let isMounted = true;
  React.useEffect(() => {
    getParams()
      .then((p) => {
        if (isMounted) {
          if (isParameter(p)) {
            setParams(p);
          } else {
            setParams(defaultParams);
            chrome.storage.sync.set(defaultParams);
          }
        }
      })
      .catch((e) => console.log(e));
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
