import { IChat } from "../chat";
import { MILDOM_REGEX, TWITCH_REGEX, YOUTUBE_REGEX } from "../config";
import { Youtube } from "./youtube";
import { Mildom } from "./mildom";
import { Twitch } from "./twitch";
import { Streamer } from "../streamer";

export interface ISource {
  extractChats: (lookNum: number) => IChat[];
  extractStreamer: () => Streamer;
}

export const selectSource = (url: string): ISource | null => {
  if (YOUTUBE_REGEX.test(url)) {
    return Youtube;
  } else if (MILDOM_REGEX.test(url)) {
    return Mildom;
  } else if (TWITCH_REGEX.test(url)) {
    return Twitch;
  }
  return null;
};
