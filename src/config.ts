import { getItems } from "./storage";

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

export const DEFAULT_EXECUTION_INTERVAL_MS = 3000;
export const OBSERVATION_INTERVAL_MS = 5000;

export const YOUTUBE_REGEX = /https:\/\/www\.youtube\.com.*/;
export const MILDOM_REGEX = /https:\/\/www\.mildom\.com.*/;

export const defaultParams: IParameter = {
  [KEY_REPEAT_THROW]: DEFAULT_REPEAT_THROW_THRESHOLD,
  [KEY_REPEAT_WORD]: DEFAULT_REPEAT_WORD_THRESHOLD,
  [KEY_LOOK_CHATS]: DEFAULT_LOOK_CHATS,
  [KEY_EXECUTION_INTERVAL]: DEFAULT_EXECUTION_INTERVAL_MS,
  [KEY_NG_WORDS]: DEFAULT_NG_WORDS,
};

export const serializedParams = (
  params: IParameter
): { [key: string]: any } => {
  return {
    ...params,
    [KEY_NG_WORDS]: JSON.stringify(params.ng_words),
  };
};

export const parseParams = (paramsJson: any): IParameter => {
  const params = {
    ...paramsJson,
    ng_words: JSON.parse(paramsJson[KEY_NG_WORDS]),
  };
  if (!isParameter(params)) throw "incorrect parameter format";

  return params;
};

export interface IParameter {
  repeat_throw_threshold: number;
  repeat_word_threshold: number;
  look_chats: number;
  execution_interval: number;
  ng_words: string[];
}

export const isParameter = (arg: any): arg is IParameter => {
  return (
    arg.repeat_throw_threshold !== undefined &&
    arg.repeat_word_threshold !== undefined &&
    arg.look_chats !== undefined &&
    arg.execution_interval !== undefined &&
    arg.ng_words !== undefined
  );
};

export const getNgWords = async (): Promise<string[]> => {
  const ngWordsJson: any = await getItems([KEY_NG_WORDS]);
  if (!ngWordsJson) return [];
  let ngWords: string[];
  try {
    ngWords = JSON.parse(ngWordsJson[KEY_NG_WORDS]);
  } catch (e) {
    throw e;
  }
  return ngWords;
};

export const getParams = async (): Promise<IParameter> => {
  const paramsJson = await getItems(paramKeys()).catch(() => defaultParams);
  let params = defaultParams;
  try {
    params = parseParams(paramsJson);
  } catch (e) {
    throw e;
  }

  return params;
};
