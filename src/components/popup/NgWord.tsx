import React from "react";
import styled from "styled-components";
import { DispatchType } from "./NgWordPage";
import { getNgWords } from "../../config";

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

export const NgWordList = (props: {
  dispatch: DispatchType;
  ngWords: string[];
}) => {
  const { dispatch, ngWords } = props;

  const onClick = (word: string) => {
    return () => {
      dispatch({ type: "delete", ngWord: word });
    };
  };

  return (
    <StyledUl>
      {ngWords.map((ngWord, i) => (
        <StyledLi key={i}>
          <StyledDeleteSpan>{ngWord}</StyledDeleteSpan>
          <StyledDeleteButton onClick={onClick(ngWord)}>×</StyledDeleteButton>
        </StyledLi>
      ))}
    </StyledUl>
  );
};

const isValidInput = async (text: string): Promise<boolean> => {
  if (text === "") return false;
  const ngWords = await getNgWords().catch((e) => console.error(e));
  if (!ngWords) return false;
  console.log(ngWords);
  return !ngWords.includes(text);
};

export const NgWordInput = (props: { dispatch: DispatchType }) => {
  const { dispatch } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef && inputRef.current) {
      const isValid = await isValidInput(inputRef.current.value);
      if (isValid) {
        dispatch({ type: "save", ngWord: inputRef.current.value });
        inputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <StyledInput ref={inputRef} placeholder={"NGワードを入力"} />
      </form>
      <StyledSpan>※Enterで保存</StyledSpan>
    </>
  );
};
