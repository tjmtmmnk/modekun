import React from "react";
import ReactDOM from "react-dom";
import { getParam } from "./api";
import PopupPage from "./components/popup";

import { IParameterV2 } from "./config";

export const useParams = (): IParameterV2 | undefined => {
  const [params, setParams] = React.useState<IParameterV2>();
  let isMounted = true;
  React.useEffect(() => {
    getParam().then((param) => {
      if (isMounted) {
        setParams(param);
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
