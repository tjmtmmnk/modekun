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
  ngWords: string[];
}

type Action =
  | { type: "init"; ngWords: string[] }
  | { type: "save"; ngWord: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "init":
      return { ...state, ngWords: action.ngWords };
    case "save":
      setItem({ [KEY_NG_WORDS]: JSON.stringify(state.ngWords) });
      return { ...state, ngWords: [...state.ngWords, action.ngWord] };
  }
};

export type DispatchType = (action: Action) => void;

export const NgWordPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    ngWords: [],
  });

  React.useEffect(() => {
    let isMounted = true;
    getItems([KEY_NG_WORDS]).then((item) => {
      if (isMounted) {
        if (!item[KEY_NG_WORDS]) {
          dispatch({ type: "init", ngWords: [] });
        } else {
          let ngWords: string[] = [];
          try {
            ngWords = JSON.parse(item[KEY_NG_WORDS]);
          } catch (e) {
            console.error(item[KEY_NG_WORDS]);
            console.error(e);
            return;
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
      <NgWordList ngWords={state.ngWords} />
      <NgWordInput dispatch={dispatch} />
    </StyledContainer>
  );
};
