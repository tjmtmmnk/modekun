import React from "react";
import styled from "styled-components";
import { CheckBox } from "./CheckBox";
import {
  IParameter,
  KEY_CONSIDER_AUTHOR_LENGTH,
  KEY_CONSIDER_AUTHOR_NGWORD,
  KEY_IS_ACTIVATE,
  KEY_IS_HIDE_COMPLETELY,
  KEY_IS_SHOW_REASON,
} from "../../config";
import { useParams } from "../../popup";

const StyledContainer = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1em;
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

export const OptionPage = () => {
  const params = useParams();
  return <>{params && <OptionPageChild params={params} />}</>;
};

export const OptionPageChild = (props: { params: IParameter }) => {
  const { params } = props;
  return (
    <StyledContainer>
      <StyledUl>
        <StyledLi>
          <CheckBox
            id={"activate-switch"}
            label={chrome.i18n.getMessage("activateModekun")}
            storageKey={KEY_IS_ACTIVATE}
            defaultChecked={params[KEY_IS_ACTIVATE]}
          />
        </StyledLi>
        <StyledLi>
          <CheckBox
            id={"reason-switch"}
            label={chrome.i18n.getMessage("showHiddenReason")}
            storageKey={KEY_IS_SHOW_REASON}
            defaultChecked={params[KEY_IS_SHOW_REASON]}
          />
        </StyledLi>
        <StyledLi>
          <CheckBox
            id={"consider-author-ngword"}
            label={chrome.i18n.getMessage("includePosterInNgWord")}
            storageKey={KEY_CONSIDER_AUTHOR_NGWORD}
            defaultChecked={params[KEY_CONSIDER_AUTHOR_NGWORD]}
          />
        </StyledLi>
        <StyledLi>
          <CheckBox
            id={"consider-author-length"}
            label={chrome.i18n.getMessage("includePosterInLimitChars")}
            storageKey={KEY_CONSIDER_AUTHOR_LENGTH}
            defaultChecked={params[KEY_CONSIDER_AUTHOR_LENGTH]}
          />
        </StyledLi>
        <StyledLi>
          <CheckBox
            id={"is-hide-completely"}
            label={chrome.i18n.getMessage("isHideCompletely")}
            storageKey={KEY_IS_HIDE_COMPLETELY}
            defaultChecked={params[KEY_IS_HIDE_COMPLETELY]}
          />
        </StyledLi>
      </StyledUl>
    </StyledContainer>
  );
};
