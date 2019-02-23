// @flow
import React from "react";

const getColor = number => {
  const colors = ["blue", "coral", "gold", "green", "violet"];
  if (number >= colors.length) {
    return getColor(number - colors.length);
  }
  const color = colors[number];
  console.log("returning color: ", color, number);
  return color;
};

const ZapPhraseTitle = () => {
  const letters = ["Z", "A", "P", " ", "P", "H", "R", "A", "S", "E"];
  return (
    <h1 className="zap-phrase-title">
      {letters.map((letter, i) => (
        <span className={`${getColor(i)}-text`}>{letter}</span>
      ))}
    </h1>
  );
};

export default ZapPhraseTitle;
