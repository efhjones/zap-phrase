// @flow
import React, { Component } from "react";

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
    const { players } = this.props;
    return (
      <div className="vertical-section">
        <div className="current-players">
          Current players:
          <ul>
            {players.length > 0 ? (
              players.map(player => {
                return (
                  <li key={player.socketId}>
                    {player.name}
                    {player.name === this.props.name && (
                      <span> --That's you!</span>
                    )}
                  </li>
                );
              })
            ) : (
              <span className="no-players">No Players :'(</span>
            )}
          </ul>
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
              type="submit"
              onClick={this.joinGame}
              className="button start"
            >
              Join
            </button>
          </section>
        )}
        <button
          disabled={players.length < 2}
          className="button start"
          onClick={this.props.startGame}
        >
          {players.length >= 2 ? "start" : "need moar players"}
        </button>
      </div>
    );
  }
}

export default JoinGame;
