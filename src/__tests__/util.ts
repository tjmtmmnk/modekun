import { kanaToHiragana, removeSymbols } from "../util";

describe("kanaToHiragana", () => {
  test("all kana", () => {
    expect(kanaToHiragana("アイウ")).toBe("あいう");
  });
  test("kana and hiragana", () => {
    expect(kanaToHiragana("あイう")).toBe("あいう");
  });
  test("all hiragana", () => {
    expect(kanaToHiragana("あいう")).toBe("あいう");
  });
  test("number", () => {
    expect(kanaToHiragana("1２")).toBe("1２");
  });
});

describe("removeSymbols", () => {
  test("half size", () => {
    expect(removeSymbols("こんにちは!")).toBe("こんにちは");
  });
  test("full size", () => {
    expect(removeSymbols("こんにちは！")).toBe("こんにちは");
  });
  test("multi times", () => {
    expect(removeSymbols("こん!にちは!!")).toBe("こんにちは");
  });
  test("no symbol", () => {
    expect(removeSymbols("こんにちはアァ亜")).toBe("こんにちはアァ亜");
  });
  test("various symbols", () => {
    expect(
      removeSymbols("こんにちはー〜!@#$%^&*()-+[]{}！＠＃＄％＾＆＊（）＿＋")
    ).toBe("こんにちは");
  });
});
