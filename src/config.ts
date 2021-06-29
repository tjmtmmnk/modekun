import { getItems } from "./storage";

export const KEY_REPEAT_THROW = "repeat_throw_threshold";
export const KEY_REPEAT_WORD = "repeat_word_threshold";
export const KEY_POST_FLOOD = "post_flood_threshold";
export const KEY_LENGTH = "length_threshold";
export const KEY_LOOK_CHATS = "look_chats";
export const KEY_EXECUTION_INTERVAL = "execution_interval";
export const KEY_NG_WORDS = "ng_words";
export const KEY_IS_SHOW_REASON = "is_show_reason";
export const KEY_IS_ACTIVATE = "is_activate_modekun";

export const paramKeys = () => {
  return [
    KEY_REPEAT_THROW,
    KEY_REPEAT_WORD,
    KEY_POST_FLOOD,
    KEY_LENGTH,
    KEY_LOOK_CHATS,
    KEY_EXECUTION_INTERVAL,
    KEY_NG_WORDS,
    KEY_IS_SHOW_REASON,
    KEY_IS_ACTIVATE,
  ];
};

const DEFAULT_REPEAT_THROW_THRESHOLD = 2;
const DEFAULT_REPEAT_WORD_THRESHOLD = 2;
const DEFAULT_POST_FLOOD_THRESHOLD = 5;
const DEFAULT_LENGTH_THRESHOLD = 200;
const DEFAULT_LOOK_CHATS = 50;
const DEFAULT_NG_WORDS: string[] = [];
const DEFAULT_IS_SHOW_REASON = false;
const DEFAULT_IS_ACTIVATE = true;

export const DEFAULT_EXECUTION_INTERVAL_MS = 3000;
export const OBSERVATION_INTERVAL_MS = 5000;

export const YOUTUBE_REGEX = /https:\/\/www\.youtube\.com.*/;
export const MILDOM_REGEX = /https:\/\/www\.mildom\.com.*/;

export const defaultParams: IParameter = {
  [KEY_REPEAT_THROW]: DEFAULT_REPEAT_THROW_THRESHOLD,
  [KEY_REPEAT_WORD]: DEFAULT_REPEAT_WORD_THRESHOLD,
  [KEY_POST_FLOOD]: DEFAULT_POST_FLOOD_THRESHOLD,
  [KEY_LENGTH]: DEFAULT_LENGTH_THRESHOLD,
  [KEY_LOOK_CHATS]: DEFAULT_LOOK_CHATS,
  [KEY_EXECUTION_INTERVAL]: DEFAULT_EXECUTION_INTERVAL_MS,
  [KEY_NG_WORDS]: DEFAULT_NG_WORDS,
  [KEY_IS_SHOW_REASON]: DEFAULT_IS_SHOW_REASON,
  [KEY_IS_ACTIVATE]: DEFAULT_IS_ACTIVATE,
};

export interface IParameter {
  repeat_throw_threshold: number;
  repeat_word_threshold: number;
  post_flood_threshold: number;
  length_threshold: number;
  look_chats: number;
  execution_interval: number;
  ng_words: string[];
  is_show_reason: boolean;
  is_activate_modekun: boolean;
}

export const isParameter = (arg: any): arg is IParameter => {
  return (
    arg.repeat_throw_threshold !== undefined &&
    arg.repeat_word_threshold !== undefined &&
    arg.post_flood_threshold !== undefined &&
    arg.length_threshold !== undefined &&
    arg.look_chats !== undefined &&
    arg.execution_interval !== undefined &&
    arg.ng_words !== undefined &&
    arg.is_show_reason !== undefined &&
    arg.is_activate_modekun !== undefined
  );
};

export const getNgWords = async (): Promise<string[]> => {
  const ngWordsJson: any = await getItems([KEY_NG_WORDS]);
  if (!ngWordsJson) return [];
  const ngWords = ngWordsJson[KEY_NG_WORDS];
  return Array.isArray(ngWords) ? ngWords : [];
};

export const getParams = async (): Promise<IParameter> => {
  const params = await getItems(paramKeys()).catch((e) => {
    throw e;
  });
  return { ...defaultParams, ...params };
};
