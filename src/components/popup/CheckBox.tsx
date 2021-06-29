import React, { useState } from "react";
import styled from "styled-components";
import { theme } from "../style/theme";

const StyledCheckBoxWrapper = styled.div`
  position: relative;
  right: 26px;
`;
const StyledCheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;
const StyledCheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${StyledCheckBoxLabel} {
    background: #4fbe79;
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;

const StyledSpan = styled.span`
  margin-right: auto;
  color: ${(props) => props.theme.labelColor};
  font-weight: bold;
`;

const StyledContainer = styled.div`
  display: flex;
`;

export const CheckBox = (props: {
  id: string;
  label: string;
  storageKey: string;
  defaultChecked: boolean;
}) => {
  const { id, label, storageKey, defaultChecked } = props;

  const [checked, setChecked] = useState(defaultChecked);

  React.useEffect(() => {
    chrome.storage.sync.set({ [storageKey]: checked });
  }, [checked]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setChecked(e.target.checked);
  };

  return (
    <StyledContainer>
      <StyledSpan theme={theme}>{label}</StyledSpan>
      <StyledCheckBoxWrapper>
        <StyledCheckBox
          id={id}
          type="checkbox"
          onChange={onChange}
          checked={checked}
        />
        <StyledCheckBoxLabel htmlFor={id} />
      </StyledCheckBoxWrapper>
    </StyledContainer>
  );
};
