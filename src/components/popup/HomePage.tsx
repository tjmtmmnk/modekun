import { RangeSlider } from "./RangeSlider";
import {
  IParameter,
  KEY_EXECUTION_INTERVAL,
  KEY_LOOK_CHATS,
  KEY_POST_FLOOD,
  KEY_REPEAT_THROW,
  KEY_REPEAT_WORD,
} from "../../config";
import React from "react";
import styled from "styled-components";
import { useParams } from "../../popup";

const StyledContainer = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1em;
`;

export const HomePage = () => {
  const params = useParams();
  return <>{params && <HomePageChild params={params} />}</>;
};

export const HomePageChild = (props: { params: IParameter }) => {
  const { params } = props;
  return (
    <StyledContainer>
      <RangeSlider
        label={"連投閾値"}
        unitLabel={"回"}
        min={1}
        max={10}
        step={1}
        defaultValue={params[KEY_REPEAT_THROW]}
        storageKey={KEY_REPEAT_THROW}
      />
      <RangeSlider
        label={"単語繰り返し閾値"}
        unitLabel={"回"}
        min={1}
        max={20}
        step={1}
        defaultValue={params[KEY_REPEAT_WORD]}
        storageKey={KEY_REPEAT_WORD}
      />
      <RangeSlider
        label={"投稿頻度"}
        unitLabel={"個/コメント数"}
        min={1}
        max={50}
        step={1}
        defaultValue={params[KEY_POST_FLOOD]}
        storageKey={KEY_POST_FLOOD}
      />
      <RangeSlider
        label={"制御対象コメント数"}
        unitLabel={"個"}
        min={1}
        max={250}
        step={1}
        defaultValue={params[KEY_LOOK_CHATS]}
        storageKey={KEY_LOOK_CHATS}
      />
      <RangeSlider
        label={"実行間隔"}
        unitLabel={"ms"}
        min={500}
        max={10000}
        step={100}
        defaultValue={params[KEY_EXECUTION_INTERVAL]}
        storageKey={KEY_EXECUTION_INTERVAL}
      />
    </StyledContainer>
  );
};
