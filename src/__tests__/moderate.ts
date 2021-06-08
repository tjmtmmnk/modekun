import { IChat } from "../chat";
import {
  hideByLength,
  hideNgWords,
  hidePostFlood,
  hideRepeatThrow,
  hideRepeatWords,
} from "../moderate";
import { IKuromojiWorker } from "../kuromoji.worker";
import { IParameter } from "../config";
import { KuromojiToken } from "kuromojin";

describe("moderate", () => {
  const params: IParameter = {
    repeat_throw_threshold: 2,
    repeat_word_threshold: 2,
    post_flood_threshold: 2,
    look_chats: 10,
    execution_interval: 1000,
    ng_words: ["なう"],
  };
  describe("hideRepeatWords", () => {
    const chats: IChat[] = [
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
      bulkTokenize: (texts: string[]) =>
        new Promise<KuromojiToken[][]>((resolve) => {
          resolve();
        }),
      getMaxRepeatWordCounts: (texts: string[]) =>
        new Promise<number[]>((resolve) => {
          resolve([1, 3]);
        }),
    };
    test("can hide", async () => {
      await hideRepeatWords(params, apiMock, chats);
      expect(chats[0].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[1].element.dataset.isHiddenByModekun).toBeTruthy();
    });
  });

  describe("hideRepeatThrow", () => {
    const chats: IChat[] = [
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
      hideRepeatThrow(params, chats);
      expect(chats[0].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[1].element.dataset.isHiddenByModekun).toBeTruthy();
      expect(chats[2].element.dataset.isHiddenByModekun).toBeTruthy();
      expect(chats[3].element.dataset.isHiddenByModekun).toBeTruthy();
    });
  });

  describe("hideNgWords", () => {
    const chats: IChat[] = [
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
      {
        key: "test3なうい",
        author: "test3",
        message: "なうい",
        element: document.createElement("div"),
      },
      {
        key: "test4ないた",
        author: "test4",
        message: "ないた",
        element: document.createElement("div"),
      },
    ];
    test("can hide", () => {
      hideNgWords(params, chats);
      expect(chats[0].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[1].element.dataset.isHiddenByModekun).toBeTruthy();
      expect(chats[2].element.dataset.isHiddenByModekun).toBeTruthy();
      expect(chats[3].element.dataset.isHiddenByModekun).toBeFalsy();
    });
  });

  describe("hidePostFlood", () => {
    const chats: IChat[] = [
      {
        key: "test1こんにちは",
        author: "test1",
        message: "こんにちは",
        element: document.createElement("div"),
      },
      {
        key: "test1こんにち",
        author: "test1",
        message: "こんにち",
        element: document.createElement("div"),
      },
      {
        key: "test2こんにちは",
        author: "test2",
        message: "こんにちは",
        element: document.createElement("div"),
      },
    ];

    test("can hide", () => {
      hidePostFlood(params, chats);
      expect(chats[0].element.dataset.isHiddenByModekun).toBeTruthy();
      expect(chats[1].element.dataset.isHiddenByModekun).toBeTruthy();
      expect(chats[2].element.dataset.isHiddenByModekun).toBeFalsy();
    });
  });

  describe("hideByLength", () => {
    const chats: IChat[] = [
      {
        key: "test1ab",
        author: "test1",
        message: "ab",
        element: document.createElement("div"),
      },
      {
        key: "test1あい",
        author: "test1",
        message: "あい",
        element: document.createElement("div"),
      },
      {
        key: "test1😇😇",
        author: "test1",
        message: "😇😇",
        element: document.createElement("div"),
      },
      {
        key: "test1吉吉",
        author: "test1",
        message: "吉吉",
        element: document.createElement("div"),
      },
      {
        key: "test1文字数オーバー",
        author: "test1",
        message: "文字数オーバー",
        element: document.createElement("div"),
      },
    ];
    test("can hide", () => {
      hideByLength(params, chats);
      expect(chats[0].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[1].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[2].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[3].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[4].element.dataset.isHiddenByModekun).toBeTruthy();
    });
  });
});
