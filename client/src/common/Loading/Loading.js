import React from "react";
import Spinner from "../Spinner";

import "./Loading.css";

const Loading = props => {
  return (
    <div className="loading-container">
      <Spinner color={"blue"} />
    </div>
  );
};

export default Loading;
