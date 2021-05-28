import { RangeSlider } from "./RangeSlider";
import {
  KEY_EXECUTION_INTERVAL,
  KEY_LOOK_CHATS,
  KEY_REPEAT_THROW,
  KEY_REPEAT_WORD,
} from "../../config";
import * as React from "react";
import styled from "styled-components";
import { useParams } from "../../popup";
import { IParameter } from "../../moderate";

const StyledContainer = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
        label={"連投閾値 (回)"}
        min={1}
        max={10}
        step={1}
        defaultValue={params[KEY_REPEAT_THROW]}
        storageKey={KEY_REPEAT_THROW}
      />
      <RangeSlider
        label={"単語繰り返し閾値 (回)"}
        min={1}
        max={20}
        step={1}
        defaultValue={params[KEY_REPEAT_WORD]}
        storageKey={KEY_REPEAT_WORD}
      />
      <RangeSlider
        label={"制御対象コメント数 (個)"}
        min={1}
        max={250}
        step={1}
        defaultValue={params[KEY_LOOK_CHATS]}
        storageKey={KEY_LOOK_CHATS}
      />
      <RangeSlider
        label={"実行間隔 (ms)"}
        min={500}
        max={10000}
        step={100}
        defaultValue={params[KEY_EXECUTION_INTERVAL]}
        storageKey={KEY_EXECUTION_INTERVAL}
      />
    </StyledContainer>
  );
};
