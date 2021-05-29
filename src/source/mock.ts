import { ISource } from "./source";
import { IChat } from "../chat";

export class Mock implements ISource {
  extractChats(): IChat[] {
    return [
      {
        key: "test1こんにちは",
        author: "test1",
        message: "こんにちは",
        element: document.createElement("div"),
      },
      {
        key: "test1ab",
        author: "test1",
        message: "ab",
        element: document.createElement("div"),
      },
      {
        key: "test1最強最強最強",
        author: "test1",
        message: "最強最強最強",
        element: document.createElement("div"),
      },
    ];
  }
}
