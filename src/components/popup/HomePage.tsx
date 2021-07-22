import { RangeSlider } from "./RangeSlider";
import {
  IParameter,
  KEY_EXECUTION_INTERVAL,
  KEY_LENGTH,
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
        label={chrome.i18n.getMessage("repeatPostThreshold")}
        unitLabel={chrome.i18n.getMessage("times")}
        min={1}
        max={10}
        step={1}
        defaultValue={params[KEY_REPEAT_THROW]}
        storageKey={KEY_REPEAT_THROW}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("repeatWordsThreshold")}
        unitLabel={chrome.i18n.getMessage("times")}
        min={1}
        max={20}
        step={1}
        defaultValue={params[KEY_REPEAT_WORD]}
        storageKey={KEY_REPEAT_WORD}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("postFrequency")}
        unitLabel={chrome.i18n.getMessage("piecePerComments")}
        min={1}
        max={50}
        step={1}
        defaultValue={params[KEY_POST_FLOOD]}
        storageKey={KEY_POST_FLOOD}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("maxNumOfCharacters")}
        unitLabel={""}
        min={1}
        max={200}
        step={1}
        defaultValue={params[KEY_LENGTH]}
        storageKey={KEY_LENGTH}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("numOfControllerdComments")}
        unitLabel={chrome.i18n.getMessage("piece")}
        min={1}
        max={250}
        step={1}
        defaultValue={params[KEY_LOOK_CHATS]}
        storageKey={KEY_LOOK_CHATS}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("executionInterval")}
        unitLabel={"ms"}
        min={50}
        max={10000}
        step={100}
        defaultValue={params[KEY_EXECUTION_INTERVAL]}
        storageKey={KEY_EXECUTION_INTERVAL}
      />
    </StyledContainer>
  );
};
