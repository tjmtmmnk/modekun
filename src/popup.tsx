import React from "react";
import ReactDOM from "react-dom";
import PopupPage from "./components/popup";

import { defaultParamsV2, IParameterV2, KEY_MODEKUN_PARAM } from "./config";
import { get } from "./storage";

export const useParams = (): IParameterV2 | undefined => {
  const [params, setParams] = React.useState<IParameterV2>();
  let isMounted = true;
  React.useEffect(() => {
    get<string | undefined>(KEY_MODEKUN_PARAM).then((paramKey) => {
      if (paramKey) {
        get<IParameterV2 | undefined>(paramKey).then((params) => {
          if (isMounted) {
            setParams(params);
          }
        });
      } else {
        if (isMounted) {
          setParams(defaultParamsV2);
        }
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
