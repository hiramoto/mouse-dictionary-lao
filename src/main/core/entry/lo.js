/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

import UniqList from "uniqlist";

const TONE_MARKS = /[\u0ec8-\u0ecb]/gu;
const ZERO_WIDTH_NON_JOINER = "\u200c";
const MAX_WORD_LENGTH = 40;
const VARIANT_LIMIT = 24;

const SIMILAR_LETTER_MAP = new Map([
  ["ຣ", ["ລ"]],
  ["ລ", ["ຣ"]],
  ["ຍ", ["ຢ"]],
  ["ຢ", ["ຍ"]],
  ["ຫ", ["ຮ"]],
  ["ຮ", ["ຫ"]],
]);

const createLookupWordsLo = (sourceStr) => {
  const str = sourceStr.substring(0, MAX_WORD_LENGTH).replaceAll(ZERO_WIDTH_NON_JOINER, "").trim();
  const result = new UniqList();

  result.push(sourceStr);

  if (!str) {
    return result.toArray();
  }

  for (let i = str.length; i >= 1; i--) {
    const part = str.substring(0, i);
    result.merge(createLaoVariants(part));
  }
  return result.toArray();
};

const createLaoVariants = (word) => {
  const variants = new UniqList();
  const normalized = word.normalize("NFC");
  const toneStripped = normalized.replace(TONE_MARKS, "");

  variants.push(normalized);
  if (toneStripped !== normalized) {
    variants.push(toneStripped);
  }

  variants.merge(expandSimilarLetters(normalized));
  if (toneStripped !== normalized) {
    variants.merge(expandSimilarLetters(toneStripped));
  }

  return variants.toArray();
};

const expandSimilarLetters = (word) => {
  const variants = new Set([word]);

  for (let i = 0; i < word.length; i++) {
    const ch = word[i];
    const alternatives = SIMILAR_LETTER_MAP.get(ch);
    if (!alternatives) {
      continue;
    }
    const currentVariants = Array.from(variants);
    for (const variant of currentVariants) {
      for (const alt of alternatives) {
        if (variants.size >= VARIANT_LIMIT) {
          return Array.from(variants);
        }
        variants.add(variant.substring(0, i) + alt + variant.substring(i + 1));
      }
    }
  }
  return Array.from(variants);
};

export default createLookupWordsLo;
