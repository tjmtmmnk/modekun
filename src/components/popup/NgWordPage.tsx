import { IParameter } from "../../moderate";
import { KEY_NG_WORDS } from "../../config";
import { NgWord } from "./NgWord";
import React from "react";

export const NgWordPage = (props: { params: IParameter }) => {
  const { params } = props;
  return <NgWord storageKey={KEY_NG_WORDS} defaultValue={params.ng_words} />;
};
