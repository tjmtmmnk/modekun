import React from "react";
import ReactDOM from "react-dom";
import { IParameter, isParameter } from "./moderate";
import PopupPage from "./components/popup";

import {
  allKeys,
  defaultParams,
} from "./config";

import { getItems } from "./storage";

const Popup = () => {
  const [params, setParams] = React.useState<IParameter>();
  React.useEffect(() => {
    getItems(allKeys())
      .then((p) => {
        if (isParameter(p)) {
          setParams(p);
        } else {
          setParams(defaultParams);
        }
      })
      .catch((e) => console.log(e));
  }, []);

  return <>{params && <PopupPage params={params} />}</>;
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
