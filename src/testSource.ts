import { Source } from "./source";
import { Chat } from "./chat";

export class TestSource implements Source {
  extractChats(): Chat[] {
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
    ];
  }
}
