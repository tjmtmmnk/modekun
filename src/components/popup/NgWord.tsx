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
  max-height: 280px;
`;

const StyledLi = styled.li`
  padding: 0.5em 20px;
  background: #e3f6f5;
  border-bottom: solid 1px #3dbfb8;
  overflow-wrap: anywhere;
  max-width: 280px;
  height: auto;
  position: relative;
`;

const StyledSpan = styled.span`
  font-size: 0.3em;
  color: gray;
  margin-left: 254px;
`;

const StyledDeleteSpan = styled.span`
  position: relative;
`;

const StyledDeleteButton = styled.button`
  background: transparent;
  border: 1px solid #f00;
  border-radius: 2em;
  color: #f00;
  display: inline-block;
  font-size: 12px;
  height: 13px;
  line-height: 2px;
  margin: 0.5em 2px;
  padding: 0;
  text-align: center;
  width: 13px;
  position: absolute;
  right: 4px;
  top: 4px;
  z-index: 1;
  cursor: pointer;
`;

export const NgWordList = (props: { storageKey: string }) => {
  const { storageKey } = props;
  const [ngWords, setNgWords] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    getItems([storageKey]).then((item) => {
      if (isMounted) {
        if (!item[storageKey]) {
          setNgWords([]);
        } else {
          const ngWords: string[] = JSON.parse(item[storageKey]);
          setNgWords(ngWords);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  });

  return (
    <StyledUl>
      {ngWords.map((ngWord, i) => (
        <StyledLi key={i}>
          <StyledDeleteSpan>{ngWord}</StyledDeleteSpan>
          <StyledDeleteButton>×</StyledDeleteButton>
        </StyledLi>
      ))}
    </StyledUl>
  );
};

export const NgWordInput = (props: { storageKey: string }) => {
  const { storageKey } = props;
  const [ngWord, setNgWord] = React.useState("");
  const [doSave, setDoSave] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    if (!doSave || ngWord === "") return;
    console.log(`set ${storageKey} : ${ngWord}`);

    getItems([storageKey]).then((item) => {
      if (isMounted) {
        if (item[storageKey]) {
          const ngWords = JSON.parse(item[storageKey]);
          chrome.storage.sync.set({
            [storageKey]: JSON.stringify([...ngWords, ngWord]),
          });
        } else {
          chrome.storage.sync.set({ [storageKey]: JSON.stringify([ngWord]) });
        }
      }
    });
    setNgWord("");

    return () => {
      isMounted = false;
    };
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
