import * as StorageModule from "../storage";
import {
  defaultParams,
  getParams,
  KEY_EXECUTION_INTERVAL,
  KEY_LENGTH,
  KEY_LOOK_CHATS,
  KEY_NG_WORDS,
  KEY_POST_FLOOD,
  KEY_REPEAT_THROW,
  KEY_REPEAT_WORD,
  serializedParams,
  setParamsWithCompatibility,
} from "../config";
import { setItem } from "../storage";

describe("setParamsWithCompatibility", () => {
  const setItemSpy = jest.spyOn(StorageModule, "setItem");
  setItemSpy.mockImplementation((item: { [key: string]: any }) => {
    return Promise.resolve();
  });

  test("missing param", async () => {
    // missing past flood parameter
    jest.spyOn(StorageModule, "getItems").mockReturnValue(
      Promise.resolve({
        [KEY_REPEAT_THROW]: 2,
        [KEY_REPEAT_WORD]: 2,
        [KEY_LENGTH]: 3,
        [KEY_LOOK_CHATS]: 50,
        [KEY_EXECUTION_INTERVAL]: 3000,
        [KEY_NG_WORDS]: [],
      })
    );

    await setParamsWithCompatibility();

    const expectParams = {
      [KEY_REPEAT_THROW]: 2,
      [KEY_REPEAT_WORD]: 2,
      [KEY_POST_FLOOD]: 5,
      [KEY_LENGTH]: 3,
      [KEY_LOOK_CHATS]: 50,
      [KEY_EXECUTION_INTERVAL]: 3000,
      [KEY_NG_WORDS]: [],
    };
    expect(setItemSpy).toBeCalledWith(serializedParams(expectParams));
  });

  test("don't missing params", async () => {
    jest
      .spyOn(StorageModule, "getItems")
      .mockReturnValue(Promise.resolve(defaultParams));

    await setParamsWithCompatibility();

    expect(setItemSpy).toBeCalledWith(serializedParams(defaultParams));
  });
});

describe("getParams", () => {
  describe("don't fulfill IParameter type", () => {
    test("throw error", async () => {
      jest.spyOn(StorageModule, "getItems").mockReturnValue(
        Promise.resolve({
          [KEY_REPEAT_THROW]: 2,
          [KEY_REPEAT_WORD]: 2,
          [KEY_LENGTH]: 3,
          [KEY_LOOK_CHATS]: 50,
          [KEY_EXECUTION_INTERVAL]: 3000,
          [KEY_NG_WORDS]: JSON.stringify([]),
        })
      );
      const params = getParams();
      await expect(params).rejects.toThrowError("incorrect parameter format");
    });
  });
  describe("fulfill IParameter type", () => {
    test("can get params", async () => {
      jest
        .spyOn(StorageModule, "getItems")
        .mockReturnValue(Promise.resolve(serializedParams(defaultParams)));
      const params = await getParams();
      expect(params).toEqual(defaultParams);
    });
  });
});
