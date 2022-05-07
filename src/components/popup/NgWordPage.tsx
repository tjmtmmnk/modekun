import { IParameterV2 } from "../../config";
import {
  NgWordBulkInsertLink,
  NgWordBulkInsertInput,
  NgWordInput,
  NgWordList,
} from "./NgWord";
import React, { useEffect, useReducer } from "react";
import styled from "styled-components";
import { sendRequestToContent } from "../../message";
import { PopupDispatch, updateParam } from "../../popup";

const StyledContainer = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1em;
`;

interface State {
  param: IParameterV2;
  dispatch: PopupDispatch;
}

type Action =
  | { type: "save"; ngWord: string }
  | { type: "delete"; ngWord: string }
  | { type: "bulk-save"; ngWords: string[] };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "save": {
      const ngWords = [...state.param.ngWords, action.ngWord];
      const newParam: IParameterV2 = {
        ...state.param,
        ngWords: ngWords,
      };
      state.dispatch({ t: "update", param: newParam });
      return { ...state, param: newParam };
    }
    case "delete": {
      const ngWords = state.param.ngWords.filter(
        (word) => word !== action.ngWord
      );
      const newParam: IParameterV2 = {
        ...state.param,
        ngWords: ngWords,
      };
      state.dispatch({ t: "update", param: newParam });
      return { ...state, param: newParam };
    }
    case "bulk-save": {
      const ngWords = [...state.param.ngWords, ...action.ngWords];
      const newParam: IParameterV2 = {
        ...state.param,
        ngWords: ngWords,
      };
      state.dispatch({ t: "update", param: newParam });
      return { ...state, param: newParam };
    }
  }
};

export type DispatchType = (action: Action) => void;

interface NgWordPageProps {
  param: IParameterV2;
  popupDispatch: PopupDispatch;
}

export const NgWordPage = (props: NgWordPageProps) => {
  const { param, popupDispatch } = props;

  const [state, dispatch] = useReducer(reducer, {
    param,
    dispatch: popupDispatch,
  });

  useEffect(() => {
    updateParam(state.param);
  }, [state.param.ngWords]);

  return (
    <StyledContainer>
      <NgWordList dispatch={dispatch} ngWords={state.param.ngWords} />
      <NgWordInput dispatch={dispatch} ngWords={state.param.ngWords} />
      <NgWordBulkInsertLink />
    </StyledContainer>
  );
};

interface NgWordBulkInsertPageProps {
  param: IParameterV2;
  popupDispatch: PopupDispatch;
}
export const NgWordBulkInsertPage = (props: NgWordBulkInsertPageProps) => {
  const { param, popupDispatch } = props;
  const [state, dispatch] = useReducer(reducer, {
    param,
    dispatch: popupDispatch,
  });
  useEffect(() => {
    updateParam(state.param);
  }, [state.param.ngWords]);

  return (
    <NgWordBulkInsertInput dispatch={dispatch} ngWords={state.param.ngWords} />
  );
};
