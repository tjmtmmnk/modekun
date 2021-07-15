import { expose } from "comlink";
import { KuromojiToken, getTokenizer } from "kuromojin";
import { IKuromojiWorker } from "./kuromoji";

export class KuromojiWorker implements IKuromojiWorker {
  dicPath: string;
  constructor(dicPath: string) {
    this.dicPath = dicPath;
  }

  async bulkTokenize(texts: string[]): Promise<KuromojiToken[][]> {
    const kuromoji = await getTokenizer({ dicPath: this.dicPath });
    return texts.map((text) => kuromoji.tokenize(text));
  }

  async getMaxRepeatWordCounts(texts: string[]): Promise<number[]> {
    const TARGET_POS = ["名詞", "動詞", "形容詞", "感動詞"];
    const tokensList = await this.bulkTokenize(texts);
    const counts: number[] = [];
    for (const tokens of tokensList) {
      const wordToCount: { [word: string]: number } = {};
      for (const token of tokens) {
        if (TARGET_POS.includes(token.pos)) {
          if (!wordToCount[token.surface_form]) {
            wordToCount[token.surface_form] = 0;
          }
          wordToCount[token.surface_form]++;
        }
      }
      let maxCount = 0;
      for (const count of Object.values(wordToCount)) {
        if (count > maxCount) {
          maxCount = count;
        }
      }
      counts.push(maxCount);
    }
    return counts;
  }
}

expose(KuromojiWorker);
