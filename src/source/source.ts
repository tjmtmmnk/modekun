import { IChat } from "../chat";

export interface ISource {
  extractChats: () => IChat[];
}
