import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { getItems } from "../../storage";

const ENTER = 13;

const StyledInput = styled.input`
  margin-top: 0.8em;
  border: 1px solid #acacac;
  color: #fff;
  opacity: 0.7;
  width: 250px;
  border-radius: 10px;
  text-align: center;
  align-self: center;
  transition: all 0.3s;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  font-size: 13px;
  outline: none;
  background-color: #acacac;
  &:focus {
    width: 290px;
    outline: none;
  }
`;

const StyledUl = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
  border-top: solid 1px #3dbfb8;
  overflow-y: scroll;
`;

const StyledLi = styled.li`
  padding: 10px 20px;
  background: #e3f6f5;
  border-bottom: solid 1px #3dbfb8;
`;

const StyledSpan = styled.span`
  font-size: 0.3em;
  color: gray;
  margin-left: 254px;
`;

export const NgWordList = (props: {
  storageKey: string;
  defaultValue: string[];
}) => {
  const { storageKey, defaultValue } = props;
  const [ngWords, setNgWords] = useState(defaultValue);

  useEffect(() => {
    getItems([storageKey]).then((item) => {
      if (!item[storageKey]) return;
      const ngWords: string[] = item[storageKey];
      setNgWords(ngWords);
    });
  });

  return (
    <StyledUl>
      {ngWords.map((ngWord, i) => (
        <StyledLi key={i}>{ngWord}</StyledLi>
      ))}
    </StyledUl>
  );
};

export const NgWordInput = (props: { storageKey: string }) => {
  const { storageKey } = props;
  const [ngWord, setNgWord] = React.useState("");
  const [doSave, setDoSave] = React.useState(false);

  React.useEffect(() => {
    if (!doSave || ngWord === "") return;
    console.log(`set ${storageKey} : ${ngWord}`);

    getItems([storageKey]).then((item) => {
      const ngWords: string[] = item[storageKey];
      if (!ngWords) {
        chrome.storage.sync.set({ [storageKey]: [ngWord] });
      } else {
        chrome.storage.sync.set({ [storageKey]: [...ngWords, ngWord] });
      }
    });

    setNgWord("");
  }, [doSave]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setNgWord(event.target.value);
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    const { which } = event;
    if (which === ENTER) {
      setDoSave(true);
    } else {
      setDoSave(false);
    }
  };

  return (
    <>
      <StyledInput
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={ngWord}
        placeholder={"NGワードを入力"}
      />
      <StyledSpan>※Enterで保存</StyledSpan>
    </>
  );
};