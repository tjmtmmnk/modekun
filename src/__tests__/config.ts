import * as StorageModule from "../storage";
import {
  defaultParams,
  getParams,
  KEY_EXECUTION_INTERVAL,
  KEY_LENGTH,
  KEY_LOOK_CHATS,
  KEY_NG_WORDS,
  KEY_REPEAT_THROW,
  KEY_REPEAT_WORD,
} from "../config";

describe("getParams", () => {
  describe("don't fulfill IParameter type", () => {
    test("can get with default", async () => {
      const expectParams = {
        [KEY_REPEAT_THROW]: 2,
        [KEY_REPEAT_WORD]: 2,
        [KEY_LENGTH]: 3,
        [KEY_LOOK_CHATS]: 50,
        [KEY_EXECUTION_INTERVAL]: 3000,
        [KEY_NG_WORDS]: [],
      };
      jest
        .spyOn(StorageModule, "getItems")
        .mockReturnValue(Promise.resolve(expectParams));
      const params = await getParams();
      expect(params).toEqual({ ...defaultParams, ...expectParams });
    });
  });
  describe("fulfill IParameter type", () => {
    test("can get params", async () => {
      jest
        .spyOn(StorageModule, "getItems")
        .mockReturnValue(Promise.resolve(defaultParams));
      const params = await getParams();
      expect(params).toEqual(defaultParams);
    });
  });
});
