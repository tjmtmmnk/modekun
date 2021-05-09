export const kanaToHiragana = (str: string): string => {
  return str.replace(/[\u30a1-\u30f6]/g, (match) => {
    const chr = match.charCodeAt(0) - 0x60;
    return String.fromCharCode(chr);
  });
};

export const removeSymbols = (str: string): string => {
  return str.replace(
    /[[!"#$%&\'\\\(\)*+,-./:;<=>?@\[\]^_`{|}~「」〔〕“”〈〉『』【】＆＊・（）＄＃＠。、？！｀＋￥％＾＿ー〜]/g,
    ""
  );
};
