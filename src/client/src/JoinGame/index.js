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
        <div>
          Curent players:
          <ul>
            {players.map(player => {
              return <li key={player.socketId}>{player.name}</li>;
            })}
          </ul>
        </div>
        {this.props.name ? (
          <div>
            You're playing as: <span>{this.props.name}</span>
          </div>
        ) : (
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
          Start!
        </button>
      </div>
    );
  }
}

export default JoinGame;
