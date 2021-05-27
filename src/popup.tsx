import * as React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import { IParameter, isParameter } from "./moderate";

import {
  allKeys,
  defaultParams,
  KEY_EXECUTION_INTERVAL,
  KEY_LOOK_CHATS,
  KEY_NG_WORDS,
  KEY_REPEAT_THROW,
  KEY_REPEAT_WORD,
} from "./config";

import { RangeSlider } from "./components/RangeSlider";
import { NgWord } from "./components/NgWord";
import { getItems } from "./storage";

const StyledContainer = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

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

  return <>{params && <PopupChild params={params} />}</>;
};

const PopupChild = (props: { params: IParameter }) => {
  const { params } = props;

  return (
    <StyledContainer>
      <RangeSlider
        label={"連投閾値 (回)"}
        min={1}
        max={10}
        step={1}
        defaultValue={params.repeat_throw_threshold}
        storageKey={KEY_REPEAT_THROW}
      />
      <RangeSlider
        label={"単語繰り返し閾値 (回)"}
        min={1}
        max={20}
        step={1}
        defaultValue={params.repeat_word_threshold}
        storageKey={KEY_REPEAT_WORD}
      />
      <RangeSlider
        label={"制御対象コメント数 (個)"}
        min={1}
        max={250}
        step={1}
        defaultValue={params.look_chats}
        storageKey={KEY_LOOK_CHATS}
      />
      <RangeSlider
        label={"実行間隔 (ms)"}
        min={500}
        max={10000}
        step={100}
        defaultValue={params.execution_interval}
        storageKey={KEY_EXECUTION_INTERVAL}
      />
      <NgWord storageKey={KEY_NG_WORDS} defaultValue={params.ng_words} />
    </StyledContainer>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
