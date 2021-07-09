import { KuromojiToken } from "kuromojin";

export interface IKuromojiWorker {
  bulkTokenize: (texts: string[]) => Promise<KuromojiToken[][]>;
  getMaxRepeatWordCounts: (texts: string[]) => Promise<number[]>;
}
