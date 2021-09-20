import { RangeSlider } from "./RangeSlider";
import { IParameterV2 } from "../../config";
import React from "react";
import styled from "styled-components";
import { useParams } from "../../popup";
import { sendRequest } from "../../message";

const StyledContainer = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1em;
  font-size: 12px;
`;

export const HomePage = () => {
  const params = useParams();
  return <>{params && <HomePageChild params={params} />}</>;
};

export const HomePageChild = (props: { params: IParameterV2 }) => {
  const { params } = props;
  return (
    <StyledContainer>
      <RangeSlider
        label={chrome.i18n.getMessage("repeatPostThreshold")}
        unitLabel={chrome.i18n.getMessage("times")}
        min={1}
        max={10}
        step={1}
        defaultValue={params.repeatPostThreshold}
        updateParam={(value: number) => {
          const newParam: IParameterV2 = {
            ...params,
            repeatPostThreshold: value,
          };
          sendRequest({
            type: "UPDATE_PARAM",
            from: "POPUP",
            to: "BACKGROUND",
            data: {
              param: newParam,
            },
          });
        }}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("repeatWordsThreshold")}
        unitLabel={chrome.i18n.getMessage("times")}
        min={1}
        max={20}
        step={1}
        defaultValue={params.repeatWordThreshold}
        updateParam={(value: number) => {
          const newParam: IParameterV2 = {
            ...params,
            repeatWordThreshold: value,
          };
          sendRequest({
            type: "UPDATE_PARAM",
            from: "POPUP",
            to: "BACKGROUND",
            data: {
              param: newParam,
            },
          });
        }}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("postFrequency")}
        unitLabel={chrome.i18n.getMessage("piecePerComments")}
        min={1}
        max={50}
        step={1}
        defaultValue={params.postFrequencyThreshold}
        updateParam={(value: number) => {
          const newParam: IParameterV2 = {
            ...params,
            postFrequencyThreshold: value,
          };
          sendRequest({
            type: "UPDATE_PARAM",
            from: "POPUP",
            to: "BACKGROUND",
            data: {
              param: newParam,
            },
          });
        }}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("maxNumOfCharacters")}
        unitLabel={""}
        min={1}
        max={200}
        step={1}
        defaultValue={params.lengthThreshold}
        updateParam={(value: number) => {
          const newParam: IParameterV2 = {
            ...params,
            lengthThreshold: value,
          };
          sendRequest({
            type: "UPDATE_PARAM",
            from: "POPUP",
            to: "BACKGROUND",
            data: {
              param: newParam,
            },
          });
        }}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("numOfControllerdComments")}
        unitLabel={chrome.i18n.getMessage("piece")}
        min={1}
        max={250}
        step={1}
        defaultValue={params.lookChats}
        updateParam={(value: number) => {
          const newParam: IParameterV2 = {
            ...params,
            lookChats: value,
          };
          sendRequest({
            type: "UPDATE_PARAM",
            from: "POPUP",
            to: "BACKGROUND",
            data: {
              param: newParam,
            },
          });
        }}
      />
      <RangeSlider
        label={chrome.i18n.getMessage("executionInterval")}
        unitLabel={"ms"}
        min={50}
        max={10000}
        step={100}
        defaultValue={params.executionInterval}
        updateParam={(value: number) => {
          const newParam: IParameterV2 = {
            ...params,
            executionInterval: value,
          };
          sendRequest({
            type: "UPDATE_PARAM",
            from: "POPUP",
            to: "BACKGROUND",
            data: {
              param: newParam,
            },
          });
        }}
      />
    </StyledContainer>
  );
};
