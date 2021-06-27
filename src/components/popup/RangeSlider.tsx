import * as React from "react";
import styled from "styled-components";
import { theme } from "../style/theme";

const KEY_UP = 38;
const KEY_DOWN = 40;

const StyledContainer = styled.div`
  align-items: stretch;
  display: flex;
  height: 55px;
  justify-content: center;
  align-content: stretch;
  line-height: 1.5;
  padding: 0.5em 0.5em 0.5em 1.7em;
  list-style-type: none !important;
  background: -webkit-linear-gradient(top, #whitesmoke 0%, whitesmoke 100%);
  background: linear-gradient(to bottom, whitesmoke 0%, #dadada 100%);
  text-shadow: 1px 1px 1px whitesmoke;
  color: black;
  border-left: solid 5px #7db4e6;
`;

const StyledRangeSlider = styled.div`
  width: 100px;
  height: auto;
  position: relative;
  right: 15px;
  display: flex;
  margin-top: 18px;
`;

const StyledLabel = styled.span`
  margin-right: auto;
  position: relative;
  top: 17px;
  font-weight: bold;
  letter-spacing: 0.1em;
  color: ${(props) => props.theme.labelColor};
`;

const StyledUnitLabel = styled.span`
  margin-left: 0.5em;
  font-size: 0.5em;
`;

interface IRangeValueProps {
  newValue: number;
  newPosition: number;
}

const StyledRangeValueContainer = styled.div<IRangeValueProps>`
  position: absolute;
  top: -50%;
  left: ${(props) => `calc(${props.newValue}% + (${props.newPosition}px))`};
`;

const StyledRangeValue = styled.span`
  width: 30px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: #03a9f4;
  color: #fff;
  font-size: 12px;
  display: block;
  position: absolute;
  transform: translate(-50%, 0);
  border-radius: 6px;

  &:before {
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-top: 10px solid #03a9f4;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    top: 100%;
    left: 50%;
    margin-left: -5px;
    margin-top: -1px;
  }
`;

const StyledLine = styled.input`
  -webkit-appearance: none;
  margin: 20px 0;
  width: 100%;
  &:focus {
    outline: none;
  }
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    cursor: pointer;
    animate: 0.2s;
    background: #03a9f4;
    border-radius: 25px;
  }
  &::-webkit-slider-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 1);
    cursor: pointer;
    -webkit-appearance: none;
    margin-top: -8px;
  }
  &:focus::-webkit-slider-runnable-track {
    background: #03a9f4;
  }
`;

export const RangeSlider = (props: {
  label: string;
  unitLabel: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  storageKey: string;
}) => {
  const { label, unitLabel, min, max, step, defaultValue, storageKey } = props;
  const [currentValue, setValue] = React.useState(defaultValue);

  React.useEffect(() => {
    chrome.storage.sync.set({ [storageKey]: currentValue }, () => {
      console.log(`set ${storageKey} : ${currentValue}`);
    });
  }, [currentValue]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    const value = parseInt(event.target.value, 10);
    if (isNaN(value)) return;
    setValue(value);
  };
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    const { which } = event;
    if (which === KEY_UP) {
      setValue(currentValue + 1);
    }
    if (which === KEY_DOWN) {
      setValue(currentValue - 1);
    }
  };

  const newValue = Number(((currentValue - min) * 100) / (max - min));
  const newPosition = 10 - newValue * 0.2;

  return (
    <StyledContainer>
      <StyledLabel theme={theme}>
        {label}
        <StyledUnitLabel>({unitLabel})</StyledUnitLabel>
      </StyledLabel>
      <StyledRangeSlider>
        <StyledRangeValueContainer
          newValue={newValue}
          newPosition={newPosition}
        >
          <StyledRangeValue>{currentValue}</StyledRangeValue>
        </StyledRangeValueContainer>
        <StyledLine
          type="range"
          min={min}
          max={max}
          step={step}
          value={currentValue.toString()}
          onKeyDown={onKeyDown}
          onChange={onChange}
        />
      </StyledRangeSlider>
    </StyledContainer>
  );
};
