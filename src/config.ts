import { IParameter } from "./moderate";

export const KEY_REPEAT_THROW = "repeat_throw_threshold";
export const KEY_REPEAT_WORD = "repeat_word_threshold";
export const KEY_LOOK_CHATS = "look_chats";
export const KEY_EXECUTION_INTERVAL = "execution_interval";
export const KEY_NG_WORDS = "ng_words";

export const paramKeys = () => {
  return [
    KEY_REPEAT_THROW,
    KEY_REPEAT_WORD,
    KEY_LOOK_CHATS,
    KEY_EXECUTION_INTERVAL,
    KEY_NG_WORDS,
  ];
};

const DEFAULT_REPEAT_THROW_THRESHOLD = 2;
const DEFAULT_REPEAT_WORD_THRESHOLD = 2;
const DEFAULT_LOOK_CHATS = 50;
const DEFAULT_NG_WORDS: string[] = [];

export const DEFAULT_EXECUTION_INTERVAL_MS = 5000;

export const defaultParams: IParameter = {
  [KEY_REPEAT_THROW]: DEFAULT_REPEAT_THROW_THRESHOLD,
  [KEY_REPEAT_WORD]: DEFAULT_REPEAT_WORD_THRESHOLD,
  [KEY_LOOK_CHATS]: DEFAULT_LOOK_CHATS,
  [KEY_EXECUTION_INTERVAL]: DEFAULT_EXECUTION_INTERVAL_MS,
  [KEY_NG_WORDS]: DEFAULT_NG_WORDS,
};
