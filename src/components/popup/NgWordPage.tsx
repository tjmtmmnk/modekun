import { KEY_NG_WORDS } from "../../config";
import { NgWordInput, NgWordList } from "./NgWord";
import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 1em;
`;

export const NgWordPage = () => {
  return (
    <StyledContainer>
      <NgWordList storageKey={KEY_NG_WORDS} />
      <NgWordInput storageKey={KEY_NG_WORDS} />
    </StyledContainer>
  );
};
