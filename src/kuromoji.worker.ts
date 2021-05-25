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

  async bulkTokenize(texts: string[]) {
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
}

comlink.expose(KuromojiWorker);
