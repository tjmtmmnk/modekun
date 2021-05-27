import * as React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: 300px;
`;

export const NgWord = (props: { storageKey: string }) => {
  const { storageKey } = props;
  const [text, setText] = React.useState("");

  React.useEffect(() => {
    const words = text === "" ? [] : text.split(",");
    chrome.storage.sync.set({ [storageKey]: words });
  }, [text]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setText(event.target.value);
  };

  return (
    <StyledContainer>
      <input onChange={onChange} />
    </StyledContainer>
  );
};
