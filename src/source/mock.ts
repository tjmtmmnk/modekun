import { ISource } from "./source";
import { IChat } from "../chat";
import { Streamer } from "../streamer";

export const Mock: ISource = {
  name: "mock",
  extractChats(lookNum: number): IChat[] {
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
      {
        key: "test2こんにちは",
        author: "test2",
        message: "こんにちは",
        element: document.createElement("div"),
      },
    ];
  },
  extractStreamer() {
    const getRandomInt = (max: number) => {
      return Math.floor(Math.random() * max);
    };
    const streamer: Streamer = {
      name: getRandomInt(1000000).toString(),
    };
    return streamer;
  },
};
