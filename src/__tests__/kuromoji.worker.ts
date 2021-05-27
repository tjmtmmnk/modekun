import { KuromojiWorker } from "../kuromoji.worker";

const path = require("path");

describe("KuromojiWorker", () => {
  const kuromojiWorker = new KuromojiWorker(
    path.join(__dirname, "..", "kuromoji/dict")
  );

  test("tokenize", async () => {
    const tokens = await kuromojiWorker.tokenize("猫");
    expect(tokens.length).toBe(1);
    expect(tokens[0].pos).toBe("名詞");
  });

  test("bulkTokenize", async () => {
    const tokensList = await kuromojiWorker.bulkTokenize(["猫", "私は猫"]);
    const expected = [
      {
        length: 1,
        posList: ["名詞"],
      },
      {
        length: 3,
        posList: ["名詞", "助詞", "名詞"],
      },
    ];
    tokensList.forEach((tokens, i) => {
      const posList = tokens.map((token) => token.pos);
      expect(tokens.length).toBe(expected[i].length);
      expect(posList).toEqual(expected[i].posList);
    });
  });

  test("getMaxRepeatWordCounts", async () => {
    const counts = await kuromojiWorker.getMaxRepeatWordCounts([
      "こんにちは",
      "猫猫猫!",
    ]);
    const expected = [1, 3];
    counts.forEach((count, i) => {
      expect(count).toBe(expected[i]);
    });
  });
});
