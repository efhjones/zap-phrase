// @flow
import React, { Component } from "react";
import Teams from "./Teams.js";
import AsyncButton from "../common/Button/AsyncButton";
import { hasSufficientNumbersToPlay } from "../utils/gameUtils";

import "./styles.css";

class JoinGame extends Component {
  state = {
    name: ""
  };

  updateName = event => {
    this.setState({
      name: event.target.value
    });
  };

  joinGame = () => {
    this.props.joinGame(this.state.name);
    this.setState({
      name: ""
    });
  };

  render() {
    const { state, props } = this;
    const { teams, name } = props;
    const canPlay = hasSufficientNumbersToPlay(teams);
    return (
      <div className="vertical-section">
        <div className="current-players">
          <Teams teams={teams} name={name} />
        </div>
        <div>
          Invite others to your game with this link: {window.location.href}
        </div>
        {!props.name && (
          <form className="vertical-section">
            <label className="name-label vertical-section">
              What's your name, friend?
              <input
                className="name-field"
                type="text"
                value={state.name}
                onChange={this.updateName}
              />
            </label>
            <AsyncButton
              disabled={state.name.length === 0 || props.isWaiting}
              isLoading={props.isWaiting}
              type="submit"
              onClick={this.joinGame}
              className="button start"
            >
              Join
            </AsyncButton>
          </form>
        )}
        {Boolean(props.name) && (
          <AsyncButton
            isLoading={props.isWaiting}
            disabled={!canPlay || props.isWaiting}
            className="button start"
            onClick={props.startGame}
          >
            {canPlay ? "start" : "need moar players"}
          </AsyncButton>
        )}
      </div>
    );
  }
}

export default JoinGame;
