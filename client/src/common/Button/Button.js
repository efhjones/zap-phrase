// @flow
import React from "react";

import "./button.css";

const Button = ({
  onClick,
  disabled = false,
  children,
  size = "large",
  color = "green",
  style = {}
}) => (
  <button
    className={`button ${size} ${color}`}
    style={style}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
