import { IParameter } from "../../moderate";
import { KEY_NG_WORDS } from "../../config";
import { NgWordInput, NgWordList } from "./NgWord";
import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const NgWordPage = (props: { params: IParameter }) => {
  const { params } = props;
  return (
    <StyledContainer>
      <NgWordList storageKey={KEY_NG_WORDS} defaultValue={params.ng_words} />
      <NgWordInput storageKey={KEY_NG_WORDS} />
    </StyledContainer>
  );
};
