import React from "react";
import styled from "styled-components";
import { CheckBox } from "./CheckBox";
import { IParameter, KEY_IS_ACTIVATE, KEY_IS_SHOW_REASON } from "../../config";
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
            label={"modekunを有効にする"}
            storageKey={KEY_IS_ACTIVATE}
            defaultChecked={params[KEY_IS_ACTIVATE]}
          />
        </StyledLi>
        <StyledLi>
          <CheckBox
            id={"reason-switch"}
            label={"非表示の理由を表示する"}
            storageKey={KEY_IS_SHOW_REASON}
            defaultChecked={params[KEY_IS_SHOW_REASON]}
          />
        </StyledLi>
      </StyledUl>
    </StyledContainer>
  );
};
