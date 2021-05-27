import React from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";
import {
  DEFAULT_LOOK_CHATS,
  DEFAULT_REPEAT_THROW_THRESHOLD,
  DEFAULT_REPEAT_WORD_THRESHOLD,
} from "./moderate";

import {
  KEY_EXECUTION_INTERVAL,
  KEY_LOOK_CHATS,
  KEY_NG_WORDS,
  KEY_REPEAT_THROW,
  KEY_REPEAT_WORD,
} from "./key";

import { DEFAULT_EXECUTION_INTERVAL_MS } from "./content_script";

import { RangeSlider } from "./components/RangeSlider";
import { NgWord } from "./components/NgWord";

const StyledContainer = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Popup = () => {
  return (
    <StyledContainer>
      <RangeSlider
        label={"連投閾値 (回)"}
        min={1}
        max={10}
        step={1}
        defaultValue={DEFAULT_REPEAT_THROW_THRESHOLD}
        storageKey={KEY_REPEAT_THROW}
      />
      <RangeSlider
        label={"単語繰り返し閾値 (回)"}
        min={1}
        max={20}
        step={1}
        defaultValue={DEFAULT_REPEAT_WORD_THRESHOLD}
        storageKey={KEY_REPEAT_WORD}
      />
      <RangeSlider
        label={"制御対象コメント数 (個)"}
        min={1}
        max={250}
        step={1}
        defaultValue={DEFAULT_LOOK_CHATS}
        storageKey={KEY_LOOK_CHATS}
      />
      <RangeSlider
        label={"実行間隔 (ms)"}
        min={500}
        max={10000}
        step={100}
        defaultValue={DEFAULT_EXECUTION_INTERVAL_MS}
        storageKey={KEY_EXECUTION_INTERVAL}
      />
      <NgWord storageKey={KEY_NG_WORDS} />
    </StyledContainer>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
