// @flow
import React, { Component } from "react";
import Teams from "./Teams.js";

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

  startGame = () => {
    this.props.socket.emit("start game", "game1");
  };

  render() {
    const { teams, name } = this.props;
    const canPlay = hasSufficientNumbersToPlay(teams);
    return (
      <div className="vertical-section">
        <div className="current-players">
          <Teams teams={teams} name={name} />
        </div>
        {!this.props.name && (
          <section className="vertical-section">
            <label className="name-label vertical-section">
              What's your name, friend?
              <input
                className="name-field"
                type="text"
                value={this.state.name}
                onChange={this.updateName}
              />
            </label>
            <button
              disabled={this.state.name.length === 0}
              type="submit"
              onClick={this.joinGame}
              className="button start"
            >
              Join
            </button>
          </section>
        )}
        {!!this.props.name && (
          <button
            disabled={!canPlay}
            className="button start"
            onClick={this.startGame}
          >
            {canPlay ? "start" : "need moar players"}
          </button>
        )}
      </div>
    );
  }
}

export default JoinGame;
