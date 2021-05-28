import { KEY_NG_WORDS } from "../../config";
import { NgWordInput, NgWordList } from "./NgWord";
import React from "react";
import styled from "styled-components";
import { useParams } from "../../popup";

const StyledContainer = styled.div`
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

export const NgWordPage = () => {
  const params = useParams();

  return (
    <StyledContainer>
      {params && (
        <>
          <NgWordList storageKey={KEY_NG_WORDS} />
          <NgWordInput storageKey={KEY_NG_WORDS} />
        </>
      )}
    </StyledContainer>
  );
};
