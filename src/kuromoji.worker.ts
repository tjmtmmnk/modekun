import * as comlink from "comlink";
import { TokenizerBuilder, IpadicFeatures, builder, Tokenizer } from "kuromoji";

export class KuromojiWorker {
  kuromoji: TokenizerBuilder<IpadicFeatures>;
  constructor(dicPath: string) {
    this.kuromoji = builder({
      dicPath: dicPath,
    });
  }
  async tokenize(text: string): Promise<IpadicFeatures[]> {
    return new Promise((resolve) => {
      this.kuromoji.build((err, tokenizer) => {
        if (err) return;
        const tokens = tokenizer.tokenize(text);
        resolve(tokens);
      });
    });
  }

  async bulkTokenize(texts: string[]): Promise<IpadicFeatures[][]> {
    return new Promise((resolve) => {
      // kuromoji.build read dictionary every time, it took about 2s
      this.kuromoji.build((err, tokenizer) => {
        if (err) return;

        const tokensList = [];
        for (const text of texts) {
          const tokens = tokenizer.tokenize(text);
          tokensList.push(tokens);
        }
        resolve(tokensList);
      });
    });
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

comlink.expose(KuromojiWorker);
