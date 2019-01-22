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
      <div>
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
          <div>
            <label>
              Name:
              <input
                type="text"
                value={this.state.name}
                onChange={this.updateName}
              />
            </label>
            <button type="submit" onClick={this.joinGame}>
              Join
            </button>
          </div>
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
