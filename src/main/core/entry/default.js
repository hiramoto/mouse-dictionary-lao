/**
 * Mouse Dictionary (https://github.com/wtetsu/mouse-dictionary/)
 * Copyright 2018-present wtetsu
 * Licensed under MIT
 */

import entry from "../entry";
import entryGeneratorEn from "./en";
import entryGeneratorJa from "./ja";
import entryGeneratorLo from "./lo";

// Can add other languages here
const generators = {
  en: entryGeneratorEn,
  ja: entryGeneratorJa,
  lo: entryGeneratorLo,
  default: entryGeneratorEn,
};

const languageDetector = (text) => {
  if (isLaoText(text)) {
    return "lo";
  }
  return isEnglishText(text) ? "en" : "ja";
};

const isEnglishText = (str) => {
  let result = true;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    const isEnglishLike = (0x20 <= code && code <= 0x7e) || code === 0x2011 || code === 0x200c;
    if (!isEnglishLike) {
      result = false;
      break;
    }
  }
  return result;
};

const isLaoText = (str) => /[\u0e80-\u0eff]/u.test(str);

const build = () => {
  return entry.build(languageDetector, generators);
};

export default build;
