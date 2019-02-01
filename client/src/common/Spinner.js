import React from "react";
import { css } from "@emotion/core";
// First way to import
import { BeatLoader } from "react-spinners";
// Another way to import

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
