import { IChat } from "../chat";

export interface ISource {
  extractChats: (lookNum: number) => IChat[];
}
