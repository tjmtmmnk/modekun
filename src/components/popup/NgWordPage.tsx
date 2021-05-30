import { getNgWords, KEY_NG_WORDS } from "../../config";
import { NgWordInput, NgWordList } from "./NgWord";
import React, { useReducer } from "react";
import styled from "styled-components";
import { setItem } from "../../storage";

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
  | { type: "save"; ngWord: string }
  | { type: "delete"; ngWord: string };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "init": {
      return { ...state, ngWords: action.ngWords };
    }
    case "save": {
      const ngWords = [...state.ngWords, action.ngWord];
      setItem({ [KEY_NG_WORDS]: JSON.stringify(ngWords) });
      return { ...state, ngWords };
    }
    case "delete": {
      const ngWords = state.ngWords.filter((word) => word !== action.ngWord);
      setItem({ [KEY_NG_WORDS]: JSON.stringify(ngWords) });
      return { ...state, ngWords };
    }
  }
};

export type DispatchType = (action: Action) => void;

export const NgWordPage = () => {
  const [state, dispatch] = useReducer(reducer, {
    ngWords: [],
  });

  React.useEffect(() => {
    let isMounted = true;
    getNgWords().then((ngWords) => {
      if (isMounted) {
        dispatch({ type: "init", ngWords });
      }
    });
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return (
    <StyledContainer>
      <NgWordList dispatch={dispatch} ngWords={state.ngWords} />
      <NgWordInput dispatch={dispatch} />
    </StyledContainer>
  );
};
