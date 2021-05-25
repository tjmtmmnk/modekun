import { Chat } from "../chat";
import { hideNgWords, hideRepeatThrow, hideRepeatWords } from "../moderate";
import { IKuromojiWorker } from "../kuromoji.worker";
import { IpadicFeatures } from "kuromoji";

describe("moderate", () => {
  describe("hideRepeatWords", () => {
    const chats: Chat[] = [
      {
        key: "test1こんにちは",
        author: "test1",
        message: "こんにちは",
        element: document.createElement("div"),
      },
      {
        key: "test2最高最高最高",
        author: "test2",
        message: "最高最高最高",
        element: document.createElement("div"),
      },
    ];
    const apiMock: IKuromojiWorker = {
      tokenize: (text: string) =>
        new Promise<IpadicFeatures[]>((resolve) => {
          resolve();
        }),
      bulkTokenize: (texts: string[]) =>
        new Promise<IpadicFeatures[][]>((resolve) => {
          resolve();
        }),
      getMaxRepeatWordCounts: (texts: string[]) =>
        new Promise<number[]>((resolve) => {
          resolve([1, 3]);
        }),
    };
    test("can hide", async () => {
      await hideRepeatWords(apiMock, chats);
      expect(chats[0].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[1].element.dataset.isHiddenByModekun).toBeTruthy();
    });
  });

  describe("hideRepeatThrow", () => {
    const chats: Chat[] = [
      {
        key: "test1こんにちは",
        author: "test1",
        message: "こんにちは",
        element: document.createElement("div"),
      },
      {
        key: "test2連投",
        author: "test2",
        message: "連投",
        element: document.createElement("div"),
      },
      {
        key: "test2連投",
        author: "test2",
        message: "連投",
        element: document.createElement("div"),
      },
      {
        key: "test2連投",
        author: "test2",
        message: "連投",
        element: document.createElement("div"),
      },
    ];
    test("can hide", () => {
      hideRepeatThrow(chats);
      expect(chats[0].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[1].element.dataset.isHiddenByModekun).toBeTruthy();
      expect(chats[2].element.dataset.isHiddenByModekun).toBeTruthy();
      expect(chats[3].element.dataset.isHiddenByModekun).toBeTruthy();
    });
  });

  describe("hideRepeatThrow", () => {
    const chats: Chat[] = [
      {
        key: "test1こんにちは",
        author: "test1",
        message: "こんにちは",
        element: document.createElement("div"),
      },
      {
        key: "test2なう",
        author: "test2",
        message: "なう",
        element: document.createElement("div"),
      },
    ];
    test("can hide", () => {
      hideNgWords(chats);
      expect(chats[0].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[1].element.dataset.isHiddenByModekun).toBeTruthy();
    });
  });
});
