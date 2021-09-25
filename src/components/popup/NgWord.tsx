import React from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { DispatchType } from "./NgWordPage";

const StyledInput = styled.input`
  margin-top: 0.8em;
  border: 1px solid #acacac;
  color: #fff;
  opacity: 0.7;
  width: 14em;
  padding: 0px 1em;
  border-radius: 10px;
  text-align: center;
  align-self: center;
  transition: all 0.3s;
  -webkit-transition: all 0.3s;
  -moz-transition: all 0.3s;
  font-size: 13px;
  outline: none;
  background-color: #acacac;
  margin-left: 3em;
  &:focus {
    width: 16em;
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
  font-size: 12px;
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

const StyledBulkInsertLi = styled.li`
  text-transform: uppercase;
  text-decoration: none;
  background: #449e7c;
  padding: 5px;
  border: 2px solid #494949 !important;
  display: inline-block;
  transition: all 0.4s ease 0s;
  &:hover {
    background: #40d49b;
    transition: all 0.4s ease 0s;
  }
`;

const StyledBulkInsertDiv = styled.div`
  align-content: center;
  position: relative;
  left: 83px;
`;

const StyledBulkInsertSpan = styled.span`
  color: white;
`;

const StyledBulkInsertForm = styled.form`
  height: 270px;
`;

const StyledBulkInsertTextArea = styled.textarea`
  width: 18em;
  position: relative;
  left: 2em;
  margin-top: 1em;
  height: 15em;
`;

const StyledBulkInsertRegisterButton = styled.button`
  display: block;
  position: relative;
  top: 8px;
  left: 110px;
  padding: 5px;
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

const isValidInput = (ngWords: string[], text: string): boolean => {
  if (text === "") return false;
  // don't allow duplicate
  return !ngWords.includes(text);
};

export const NgWordInput = (props: {
  dispatch: DispatchType;
  ngWords: string[];
}) => {
  const { dispatch, ngWords } = props;

  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef && inputRef.current) {
      const isValid = isValidInput(ngWords, inputRef.current.value);
      if (isValid) {
        dispatch({ type: "save", ngWord: inputRef.current.value });
        inputRef.current.value = "";
      }
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <StyledInput
          ref={inputRef}
          placeholder={chrome.i18n.getMessage("inputNgWord")}
        />
      </form>
      <StyledSpan>※{chrome.i18n.getMessage("saveByEnter")}</StyledSpan>
    </>
  );
};

export const NgWordBulkInsertLink = () => {
  return (
    <StyledBulkInsertDiv>
      <StyledBulkInsertLi>
        <Link to={"/ngword/bulk"} style={{ textDecoration: "none" }}>
          <StyledBulkInsertSpan>
            {chrome.i18n.getMessage("bulkInsertLink")}
          </StyledBulkInsertSpan>
        </Link>
      </StyledBulkInsertLi>
    </StyledBulkInsertDiv>
  );
};

export const NgWordBulkInsertInput = (props: {
  dispatch: DispatchType;
  ngWords: string[];
}) => {
  const { dispatch, ngWords } = props;

  const history = useHistory();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputRef && inputRef.current) {
      const words = inputRef.current.value.split("\n");
      const uniqueWords = [...new Set(words)];
      const validWords = uniqueWords.filter((word) =>
        isValidInput(ngWords, word)
      );
      dispatch({ type: "bulk-save", ngWords: validWords });
      inputRef.current.value = "";
    }
    history.push("/ngword");
  };

  return (
    <>
      <StyledBulkInsertForm onSubmit={handleSubmit}>
        <StyledBulkInsertTextArea
          ref={inputRef}
          placeholder={chrome.i18n.getMessage("bulkInsertMessage")}
        />
        <StyledBulkInsertRegisterButton type="submit">
          {chrome.i18n.getMessage("bulkInsert")}
        </StyledBulkInsertRegisterButton>
      </StyledBulkInsertForm>
    </>
  );
};
