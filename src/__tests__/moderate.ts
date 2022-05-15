/**
 * @jest-environment jsdom
 */

import { IChat } from "../chat";
import {
  hide,
  hideByLength,
  hideNgWords,
  hidePostFlood,
  hideRepeatThrow,
  hideRepeatWords,
} from "../moderate";
import { IParameterV2 } from "../config";
import { KuromojiToken } from "kuromojin";
import { IKuromojiWorker } from "../kuromoji";

describe("moderate", () => {
  global.chrome = {
    // @ts-ignore
    i18n: {
      getMessage(message: string, sub?: any) {
        return "";
      },
    },
  };

  const params: IParameterV2 = {
    repeatPostThreshold: 2,
    repeatWordThreshold: 2,
    postFrequencyThreshold: 2,
    lengthThreshold: 3,
    lookChats: 10,
    executionInterval: 1000,
    ngWords: ["なう"],
    isShowReason: false,
    isActivateModekun: true,
    considerAuthorLength: false,
    considerAuthorNgWord: false,
    isHideCompletely: false,
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
          resolve([]);
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
    test("can hide", () => {
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
      hideNgWords(params, chats);
      expect(chats[0].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[1].element.dataset.isHiddenByModekun).toBeTruthy();
      expect(chats[2].element.dataset.isHiddenByModekun).toBeTruthy();
      expect(chats[3].element.dataset.isHiddenByModekun).toBeFalsy();
    });
    test("can hide by author", () => {
      const chats: IChat[] = [
        {
          key: "こんにちはtest",
          author: "こんにちは",
          message: "test",
          element: document.createElement("div"),
        },
        {
          key: "なうtest",
          author: "なう",
          message: "test",
          element: document.createElement("div"),
        },
      ];
      const param: IParameterV2 = {
        ...params,
        considerAuthorNgWord: true,
      };
      hideNgWords(param, chats);
      expect(chats[0].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[1].element.dataset.isHiddenByModekun).toBeTruthy();
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
    test("can hide", () => {
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
          key: "test1吉吉",
          author: "test1",
          message: "吉吉",
          element: document.createElement("div"),
        },
        {
          key: "test123🔥",
          author: "test123",
          message: "🔥",
          element: document.createElement("div"),
        },
        {
          key: "test1😇😇",
          author: "test1",
          message: "😇😇",
          element: document.createElement("div"),
        },
        {
          key: "test1文字数オーバー",
          author: "test1",
          message: "文字数オーバー",
          element: document.createElement("div"),
        },
      ];
      hideByLength(params, chats);
      expect(chats[0].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[1].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[2].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[3].element.dataset.isHiddenByModekun).toBeFalsy();
      expect(chats[4].element.dataset.isHiddenByModekun).toBeTruthy();
      expect(chats[5].element.dataset.isHiddenByModekun).toBeTruthy();
    });

    test("can hide by author", () => {
      const chats: IChat[] = [
        {
          key: "test123ab",
          author: "test123",
          message: "ab",
          element: document.createElement("div"),
        },
        {
          key: "testab",
          author: "test",
          message: "ab",
          element: document.createElement("div"),
        },
      ];
      const param: IParameterV2 = {
        ...params,
        lengthThreshold: 5,
        considerAuthorLength: true,
      };
      hideByLength(param, chats);
      expect(chats[0].element.dataset.isHiddenByModekun).toBeTruthy();
      expect(chats[1].element.dataset.isHiddenByModekun).toBeFalsy();
    });
  });
  describe("repeat post and repeat frequency", () => {
    const chats: IChat[] = [
      {
        key: "test1aaa",
        author: "test1",
        message: "aaa",
        element: document.createElement("div"),
      },
      {
        key: "test1aaa",
        author: "test1",
        message: "aaa",
        element: document.createElement("div"),
      },
      {
        key: "test1bbb",
        author: "test1",
        message: "bbb",
        element: document.createElement("div"),
      },
    ];
    const param: IParameterV2 = {
      ...params,
      repeatPostThreshold: 2,
      postFrequencyThreshold: 3,
    };
    test("can hide by both filter", () => {
      hideRepeatThrow(param, chats);
      hidePostFlood(param, chats);
      expect(chats[0].element.dataset.isHiddenByModekun).toBeTruthy();
      expect(chats[1].element.dataset.isHiddenByModekun).toBeTruthy();
      expect(chats[2].element.dataset.isHiddenByModekun).toBeTruthy();
    });
  });
  describe("hide", () => {
    test("can hide with no opacity", () => {
      const chat: IChat = {
        key: "test1aaa",
        author: "test1",
        message: "aaa",
        element: document.createElement("div"),
      };
      hide(params, "test", chat);
      expect(chat.element.style.opacity).toBe("0");
      expect(chat.element.style.display).not.toBe("none");
    });
    test("can hide with display none", () => {
      const param: IParameterV2 = {
        ...params,
        isHideCompletely: true,
      };
      const chat: IChat = {
        key: "test1aaa",
        author: "test1",
        message: "aaa",
        element: document.createElement("div"),
      };
      hide(param, "test", chat);
      expect(chat.element.style.opacity).not.toBe("0");
      expect(chat.element.style.display).toBe("none");
    });
    test("can hide associated elements with display none", () => {
      const param: IParameterV2 = {
        ...params,
        isHideCompletely: true,
      };
      const chat: IChat = {
        key: "test1aaa",
        author: "test1",
        message: "aaa",
        element: document.createElement("div"),
        associatedElements: [document.createElement("div")],
      };
      hide(param, "test", chat);
      expect(chat.element.style.opacity).not.toBe("0");
      expect(chat.element.style.display).toBe("none");
      expect(
        chat.associatedElements?.map((e) => e.style.display)
      ).toStrictEqual(["none"]);
    });
  });
});
