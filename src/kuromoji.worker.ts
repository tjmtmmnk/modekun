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
    let tokens: IpadicFeatures[] = [];
    await (() => {
      return new Promise<void>((done) => {
        this.kuromoji.build((err, tokenizer) => {
          if (err) return;
          tokens = tokenizer.tokenize(text);
          done();
        });
      });
    })();
    return tokens;
  }

  async bulkTokenize(texts: string[]): Promise<IpadicFeatures[][]> {
    const tokensList: IpadicFeatures[][] = [];
    await Promise.all(
      texts.map(async (text) => {
        const tokens = await this.tokenize(text);
        console.log(tokens);
        tokensList.push(tokens);
      })
    );
    return tokensList;
  }
}

comlink.expose(KuromojiWorker);
