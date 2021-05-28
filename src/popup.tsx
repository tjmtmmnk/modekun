import React from "react";
import ReactDOM from "react-dom";
import { IParameter, isParameter } from "./moderate";
import PopupPage from "./components/popup";

import { paramKeys, defaultParams } from "./config";

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
