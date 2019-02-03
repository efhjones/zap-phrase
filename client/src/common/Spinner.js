import React from "react";
import { css } from "@emotion/core";
import { BeatLoader } from "react-spinners";

const override = css`
  display: flex;
  justify-content: center;
`;

class Spinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }
  render() {
    return (
      <BeatLoader
        css={override}
        sizeUnit={"px"}
        color={this.props.color}
        size={25}
        loading={this.state.loading}
      />
    );
  }
}

export default Spinner;
