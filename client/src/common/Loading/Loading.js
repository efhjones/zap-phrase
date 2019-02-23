import React from "react";
import Spinner from "../Spinner";

import "./Loading.css";

const Loading = props => {
  return (
    <div className="loading-container">
      <Spinner color={"rgba(3, 206, 164, 1)"} />
    </div>
  );
};

export default Loading;
