import React from "react";
import styled from "styled-components";

const StyledInput = styled.input`
  margin-top: 50px;
  font-family: cursive;
  border: 1px solid #acacac;
  color: #fff;
  opacity: 0.7;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  width: 300px;
  transition: all 0.3s;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  font-size: 16px;
  outline: none;
  background-color: #acacac;
  &:focus {
    width: 600px;
    height: 300px;
    outline: none;
  }
`;

export const NgWord = (props: { storageKey: string; defaultValue: string }) => {
  const { storageKey, defaultValue } = props;
  const [text, setText] = React.useState(defaultValue);

  React.useEffect(() => {
    console.log(`set ${storageKey} : ${text}`);
    chrome.storage.sync.set({ [storageKey]: text });
  }, [text]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setText(event.target.value);
  };

  return <StyledInput onChange={onChange} value={text} />;
};
