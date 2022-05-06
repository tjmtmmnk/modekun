import { IParameterV2 } from "../../config";
import {
  NgWordBulkInsertLink,
  NgWordBulkInsertInput,
  NgWordInput,
  NgWordList,
} from "./NgWord";
import React, { useReducer } from "react";
import styled from "styled-components";
import { sendRequest } from "../../message";
import { PopupDispatch } from "../../popup";

const StyledContainer = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1em;
`;

interface State {
  param: IParameterV2;
}

type Action =
  | { type: "save"; ngWord: string }
  | { type: "delete"; ngWord: string }
  | { type: "bulk-save"; ngWords: string[] };

const reducer = (popupDispatch: PopupDispatch) => {
  return (state: State, action: Action): State => {
    switch (action.type) {
      case "save": {
        const ngWords = [...state.param.ngWords, action.ngWord];
        const newParam: IParameterV2 = {
          ...state.param,
          ngWords: ngWords,
        };
        popupDispatch({ t: "update", param: newParam });
        return { param: newParam };
      }
      case "delete": {
        const ngWords = state.param.ngWords.filter(
          (word) => word !== action.ngWord
        );
        const newParam: IParameterV2 = {
          ...state.param,
          ngWords: ngWords,
        };
        popupDispatch({ t: "update", param: newParam });
        return { param: newParam };
      }
      case "bulk-save": {
        const ngWords = [...state.param.ngWords, ...action.ngWords];
        const newParam: IParameterV2 = {
          ...state.param,
          ngWords: ngWords,
        };
        popupDispatch({ t: "update", param: newParam });
        return { param: newParam };
      }
    }
  };
};

export type DispatchType = (action: Action) => void;

interface NgWordPageProps {
  param: IParameterV2;
  dispatch: PopupDispatch;
}

export const NgWordPage = (props: NgWordPageProps) => {
  const { param, dispatch } = props;
  const [state, ngWordDispatch] = useReducer(reducer(dispatch), {
    param,
  });

  return (
    <StyledContainer>
      <NgWordList dispatch={ngWordDispatch} ngWords={state.param.ngWords} />
      <NgWordInput dispatch={ngWordDispatch} ngWords={state.param.ngWords} />
      <NgWordBulkInsertLink />
    </StyledContainer>
  );
};

interface NgWordBulkInsertPageProps {
  param: IParameterV2;
  dispatch: PopupDispatch;
}
export const NgWordBulkInsertPage = (props: NgWordBulkInsertPageProps) => {
  const { param, dispatch } = props;
  const [state, ngWordDispatch] = useReducer(reducer(dispatch), {
    param,
  });
  return (
    <NgWordBulkInsertInput
      dispatch={ngWordDispatch}
      ngWords={state.param.ngWords}
    />
  );
};
