import { KEY_NG_WORDS } from "../../config";
import { NgWordInput, NgWordList } from "./NgWord";
import React, { useReducer } from "react";
import styled from "styled-components";
import { getItems, setItem } from "../../storage";

const StyledContainer = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1em;
`;

export interface State {
  ngWord: string;
  ngWords: string[];
  isSaved: boolean;
}

type Action =
  | { type: "init"; ngWords: string[] }
  | { type: "edit"; ngWord: string }
  | { type: "save" };

const isValidInput = (text: string): boolean => {
  return text !== "";
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "init":
      return { ...state, ngWords: action.ngWords };
    case "edit":
      return { ...state, ngWord: action.ngWord };
    case "save":
      if (isValidInput(state.ngWord)) {
        state.ngWords.push(state.ngWord);
      }
      setItem({ [KEY_NG_WORDS]: JSON.stringify(state.ngWords) });
      state.ngWord = "";
      return { ...state, ngWord: "" };
  }
};

export type DispatchType = (action: Action) => void;

export const NgWordPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    ngWord: "",
    ngWords: [],
    isSaved: false,
  });

  React.useEffect(() => {
    let isMounted = true;
    getItems([KEY_NG_WORDS]).then((item) => {
      if (isMounted) {
        if (item[KEY_NG_WORDS] === undefined) {
          dispatch({ type: "init", ngWords: [] });
        } else {
          let ngWords: string[] = [];
          try {
            ngWords = JSON.parse(item[KEY_NG_WORDS]);
          } catch (e) {
            console.log(item[KEY_NG_WORDS]);
            console.error(e);
          }
          dispatch({ type: "init", ngWords: ngWords });
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return (
    <StyledContainer>
      <NgWordList storageKey={KEY_NG_WORDS} state={state} />
      <NgWordInput
        storageKey={KEY_NG_WORDS}
        state={state}
        dispatch={dispatch}
      />
    </StyledContainer>
  );
};
