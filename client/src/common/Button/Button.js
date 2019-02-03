// @flow
import React from "react";

import "./button.css";

const Button = ({ onClick, disabled, children, kind, className }) => (
  <button
    className={`button ${kind ? kind : ""} ${className}`}
    disabled={disabled}
    onClick={onClick}
  >
    {children}
  </button>
);

export default Button;
