// @flow
import React from "react";

const getColor = number => {
  const colors = ["blue", "orange", "gold", "green", "violet"];
  if (number >= colors.length) {
    return getColor(number - colors.length);
  }
  const color = colors[number];
  return color;
};

const ZapPhraseTitle = () => {
  return <h1 className={`zap-phrase-title orange-text`}>Zap Phrase</h1>;
};

export default ZapPhraseTitle;
