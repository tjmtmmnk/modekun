import * as React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  width: 300px;
`;

export const NgWord = (props: { storageKey: string; defaultValue: string }) => {
  const { storageKey, defaultValue } = props;
  const [text, setText] = React.useState(defaultValue);

  React.useEffect(() => {
    console.log(`set ${storageKey} : ${text}`);
    chrome.storage.sync.set({ [storageKey]: text });
  }, [text]);

  const onChange: React.ChangeEventHandler<HTMLInputElement> = (event) => {
    setText(event.target.value);
  };

  return (
    <StyledContainer>
      <input onChange={onChange} value={text} />
    </StyledContainer>
  );
};
