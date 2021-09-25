import { IParameterV2 } from "../../config";
import { NgWordInput, NgWordList } from "./NgWord";
import React, { useReducer } from "react";
import styled from "styled-components";
import { sendRequest } from "../../message";
import { useParams } from "../../popup";

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

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "save": {
      const ngWords = [...state.param.ngWords, action.ngWord];
      const newParam: IParameterV2 = {
        ...state.param,
        ngWords: ngWords,
      };
      sendRequest({
        type: "UPDATE_PARAM",
        from: "POPUP",
        to: "BACKGROUND",
        data: {
          param: newParam,
        },
      });
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
      sendRequest({
        type: "UPDATE_PARAM",
        from: "POPUP",
        to: "BACKGROUND",
        data: {
          param: newParam,
        },
      });
      return { param: newParam };
    }
    case "bulk-save": {
      const ngWords = [...state.param.ngWords, ...action.ngWords];
      const newParam: IParameterV2 = {
        ...state.param,
        ngWords: ngWords,
      };
      sendRequest({
        type: "UPDATE_PARAM",
        from: "POPUP",
        to: "BACKGROUND",
        data: {
          param: newParam,
        },
      });
      return { param: newParam };
    }
  }
};

export type DispatchType = (action: Action) => void;

export const NgWordPage = () => {
  const param = useParams();
  return <>{param && <NgWordPageChild param={param} />}</>;
};

export const NgWordPageChild = (props: { param: IParameterV2 }) => {
  const { param } = props;
  const [state, dispatch] = useReducer(reducer, {
    param: param,
  });

  return (
    <StyledContainer>
      <NgWordList dispatch={dispatch} ngWords={state.param.ngWords} />
      <NgWordInput dispatch={dispatch} ngWords={state.param.ngWords} />
      <NgWordBulkInsertButton />
    </StyledContainer>
  );
};
