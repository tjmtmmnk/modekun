import React from "react";
import ReactDOM from "react-dom";
import {
  DEFAULT_LOOK_CHATS,
  DEFAULT_REPEAT_THROW_THRESHOLD,
  DEFAULT_REPEAT_WORD_THRESHOLD,
} from "./moderate";
import { RangeSlider } from "./components/RangeSlider";
import styled from "styled-components";

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
        label={"連投閾値"}
        min={1}
        max={10}
        step={1}
        defaultValue={DEFAULT_REPEAT_THROW_THRESHOLD}
        storageKey={"repeat-throw-threshold"}
      />
      <RangeSlider
        label={"単語繰り返し閾値"}
        min={1}
        max={20}
        step={1}
        defaultValue={DEFAULT_REPEAT_WORD_THRESHOLD}
        storageKey={"repeat-word-threshold"}
      />
      <RangeSlider
        label={"対象コメント数"}
        min={1}
        max={250}
        step={1}
        defaultValue={DEFAULT_LOOK_CHATS}
        storageKey={"look-chats"}
      />
    </StyledContainer>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
