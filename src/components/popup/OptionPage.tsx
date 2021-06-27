import React from "react";
import styled from "styled-components";
import { CheckBox } from "./CheckBox";
import { IParameter, KEY_REASON_SWITCH, KEY_REPEAT_WORD } from "../../config";
import { useParams } from "../../popup";
import { HomePageChild } from "./HomePage";

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
            id={"reason-switch"}
            label={"非表示の理由を表示する"}
            storageKey={KEY_REASON_SWITCH}
            defaultChecked={params[KEY_REASON_SWITCH]}
          />
        </StyledLi>
      </StyledUl>
    </StyledContainer>
  );
};
