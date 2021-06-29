import { IChat } from "../chat";
import {
  MILDOM_REGEX,
  OPENREC_REGEX,
  TWITCH_REGEX,
  YOUTUBE_REGEX,
} from "../config";
import { Youtube } from "./youtube";
import { Mildom } from "./mildom";
import { Twitch } from "./twitch";
import { Openrec } from "./openrec";

export interface ISource {
  extractChats: (lookNum: number) => IChat[];
}

export const selectSource = (url: string): ISource | null => {
  if (YOUTUBE_REGEX.test(url)) {
    return Youtube;
  } else if (MILDOM_REGEX.test(url)) {
    return Mildom;
  } else if (TWITCH_REGEX.test(url)) {
    return Twitch;
  } else if (OPENREC_REGEX.test(url)) {
    return Openrec;
  }
  return null;
};
