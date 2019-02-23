// @flow
import React from "react";

import "./button.css";

const Button = ({
  onClick,
  disabled = false,
  children,
  size = "large",
  color = "green",
  className = ""
}) => (
  <button
    className={`button ${size} ${color}`}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
