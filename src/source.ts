import { Chat } from "./chat";

export interface Source {
  extractChats: () => Chat[];
}
