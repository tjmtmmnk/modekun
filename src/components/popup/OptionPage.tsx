import React from "react";
import styled from "styled-components";
import { CheckBox } from "./CheckBox";
import { IParameterV2 } from "../../config";
import { sendRequest } from "../../message";

const StyledContainer = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1em;
  font-size: 12px;
`;

const StyledUl = styled.ul`
  padding: 0.5em;
  list-style-type: none;
`;

const StyledLi = styled.li`
  position: relative;
  padding: 0.5em 1em 0.5em 2.3em;
  margin: 1em 0px;
  border-bottom: 1px solid grey;
  &:before,
  &:after {
    content: "";
    position: absolute;
    border-radius: 50%;
  }
  &:before {
    top: 15px;
    left: 3px;
    width: 12px;
    height: 12px;
    background: rgba(25, 118, 210, 1);
    transform: translateY(-50%);
  }
  &:after {
    top: 18px;
    left: 10px;
    width: 7px;
    height: 7px;
    background: rgba(25, 118, 210, 0.5);
  }
`;

interface OptionPageProps {
  param: IParameterV2;
}
export const OptionPage = (props: OptionPageProps) => {
  const { param } = props;
  return <OptionPageChild params={param} />;
};

export const OptionPageChild = (props: { params: IParameterV2 }) => {
  const { params } = props;
  return (
    <StyledContainer>
      <StyledUl>
        <StyledLi>
          <CheckBox
            id={"activate-switch"}
            label={chrome.i18n.getMessage("activateModekun")}
            defaultChecked={params.isActivateModekun}
            updateParam={(checked: boolean) => {
              const newParam: IParameterV2 = {
                ...params,
                isActivateModekun: checked,
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
        </StyledLi>
        <StyledLi>
          <CheckBox
            id={"reason-switch"}
            label={chrome.i18n.getMessage("showHiddenReason")}
            defaultChecked={params.isShowReason}
            updateParam={(checked: boolean) => {
              const newParam: IParameterV2 = {
                ...params,
                isShowReason: checked,
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
        </StyledLi>
        <StyledLi>
          <CheckBox
            id={"consider-author-ngword"}
            label={chrome.i18n.getMessage("includePosterInNgWord")}
            defaultChecked={params.considerAuthorNgWord}
            updateParam={(checked: boolean) => {
              const newParam: IParameterV2 = {
                ...params,
                considerAuthorNgWord: checked,
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
        </StyledLi>
        <StyledLi>
          <CheckBox
            id={"consider-author-length"}
            label={chrome.i18n.getMessage("includePosterInLimitChars")}
            defaultChecked={params.considerAuthorLength}
            updateParam={(checked: boolean) => {
              const newParam: IParameterV2 = {
                ...params,
                considerAuthorLength: checked,
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
        </StyledLi>
        <StyledLi>
          <CheckBox
            id={"is-hide-completely"}
            label={chrome.i18n.getMessage("isHideCompletely")}
            defaultChecked={params.isHideCompletely}
            updateParam={(checked: boolean) => {
              const newParam: IParameterV2 = {
                ...params,
                isHideCompletely: checked,
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
        </StyledLi>
      </StyledUl>
    </StyledContainer>
  );
};
