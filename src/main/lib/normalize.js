/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

const LAO_PREPOSED_VOWELS = "[\u0EC0-\u0EC4]";
const LAO_CONSONANTS = "[\u0E81-\u0EAE\u0EDC-\u0EDF]";
const LAO_TONE_MARKS = "[\u0EC8-\u0ECB]";
const LAO_PRE_TONE_VOWEL_SIGNS = "[\u0EB0\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC]";

const RE_LAO_TONE_MARK = /[\u0EC8-\u0ECB]/;
const RE_TONE_BEFORE_CONSONANT = new RegExp(
  `(${LAO_PREPOSED_VOWELS})(${LAO_TONE_MARKS})(${LAO_CONSONANTS})(${LAO_PRE_TONE_VOWEL_SIGNS}*)`,
  "g",
);
const RE_TONE_BEFORE_VOWEL = new RegExp(
  `(${LAO_PREPOSED_VOWELS}?${LAO_CONSONANTS})(${LAO_TONE_MARKS})(${LAO_PRE_TONE_VOWEL_SIGNS}+)`,
  "g",
);

export const normalizeLaoToneMarks = (input) => {
  if (!input) {
    return input;
  }
  if (!RE_LAO_TONE_MARK.test(input)) {
    return input;
  }
  let result = input.normalize("NFC");
  result = result.replace(RE_TONE_BEFORE_CONSONANT, "$1$3$4$2");
  result = result.replace(RE_TONE_BEFORE_VOWEL, "$1$3$2");
  return result;
};

