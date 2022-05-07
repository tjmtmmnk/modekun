import { RangeSlider } from "./RangeSlider";
import { IParameterV2 } from "../../config";
import React, { useEffect } from "react";
import styled from "styled-components";
import { PopupDispatch } from "../../popup";
import { sendRequestToContent } from "../../message";

const StyledContainer = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1em;
  font-size: 12px;
`;

interface HomePageProps {
  param: IParameterV2;
  dispatch: PopupDispatch;
}

export const HomePage = (props: HomePageProps) => {
  const { param, dispatch } = props;
  useEffect(() => {
    sendRequestToContent({
      type: "UPDATE_PARAM",
      from: "POPUP",
      to: "CONTENT_SCRIPT",
      data: { param },
    });
  }, [
    param.repeatPostThreshold,
    param.repeatWordThreshold,
    param.postFrequencyThreshold,
    param.lengthThreshold,
    param.lookChats,
    param.executionInterval,
  ]);
  return (
    <StyledContainer>
      <RangeSlider
        label={chrome.i18n.getMessage("repeatPostThreshold")}
        unitLabel={chrome.i18n.getMessage("times")}
        min={1}
        max={10}
        step={1}
        defaultValue={param.repeatPostThreshold}
        updateParam={(value: number) => {
          const newParam: IParameterV2 = {
            ...param,
            repeatPostThreshold: value,
          };
          dispatch({ t: "update", param: newParam });
        }}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("repeatWordsThreshold")}
        unitLabel={chrome.i18n.getMessage("times")}
        min={1}
        max={20}
        step={1}
        defaultValue={param.repeatWordThreshold}
        updateParam={(value: number) => {
          const newParam: IParameterV2 = {
            ...param,
            repeatWordThreshold: value,
          };
          dispatch({ t: "update", param: newParam });
        }}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("postFrequency")}
        unitLabel={chrome.i18n.getMessage("piecePerComments")}
        min={1}
        max={50}
        step={1}
        defaultValue={param.postFrequencyThreshold}
        updateParam={(value: number) => {
          const newParam: IParameterV2 = {
            ...param,
            postFrequencyThreshold: value,
          };
          dispatch({ t: "update", param: newParam });
        }}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("maxNumOfCharacters")}
        unitLabel={""}
        min={1}
        max={200}
        step={1}
        defaultValue={param.lengthThreshold}
        updateParam={(value: number) => {
          const newParam: IParameterV2 = {
            ...param,
            lengthThreshold: value,
          };
          dispatch({ t: "update", param: newParam });
        }}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("numOfControllerdComments")}
        unitLabel={chrome.i18n.getMessage("piece")}
        min={1}
        max={250}
        step={1}
        defaultValue={param.lookChats}
        updateParam={(value: number) => {
          const newParam: IParameterV2 = {
            ...param,
            lookChats: value,
          };
          dispatch({ t: "update", param: newParam });
        }}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("executionInterval")}
        unitLabel={"ms"}
        min={50}
        max={10000}
        step={100}
        defaultValue={param.executionInterval}
        updateParam={(value: number) => {
          const newParam: IParameterV2 = {
            ...param,
            executionInterval: value,
          };
          dispatch({ t: "update", param: newParam });
        }}
      />
    </StyledContainer>
  );
};
