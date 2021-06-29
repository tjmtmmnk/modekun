import { selectSource } from "../source/source";
import { Youtube } from "../source/youtube";
import { Mildom } from "../source/mildom";
import { Twitch } from "../source/twitch";

describe("selectSource", () => {
  test("youtube", () => {
    const source = selectSource("https://www.youtube.com/watch?v=test");
    expect(source).toEqual(Youtube);
  });

  test("mildom", () => {
    const source = selectSource("https://www.mildom.com/1111");
    expect(source).toEqual(Mildom);
  });

  test("twitch", () => {
    const source = selectSource("https://www.twitch.tv");
    expect(source).toEqual(Twitch);
  });

  test("none", () => {
    const source = selectSource("https://www.none.com");
    expect(source).toBeNull();
  });
});
