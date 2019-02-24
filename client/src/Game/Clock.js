// @flow
import React, { Component } from "react";

import Button from "../common/Button/Button";

const DEFAULT_CLOCK_TIME = "3:00";

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team1: DEFAULT_CLOCK_TIME,
      team2: DEFAULT_CLOCK_TIME,
      activeTeam: "team1",
      isCounting: false,
      hasReset: false
    };

    this.props.socket.on("clock started", ({ gameId }) => {
      if (this.props.gameId === gameId) {
        this.setState({
          isCounting: true,
          hasReset: false
        });
        this.createNewTime(this.state.activeTeam);
      }
    });

    this.props.socket.on("player changed", ({ gameId }) => {
      if (gameId === this.props.gameId) {
        this.switchClock();
      }
    });

    this.props.socket.on("clock paused", ({ gameId }) => {
      if (this.props.gameId === gameId) {
        this.setState({ isCounting: false });
        clearTimeout(this.team1Timeout);
        clearTimeout(this.team2Timeout);
      }
    });

    this.props.socket.on("clock reset", ({ gameId }) => {
      if (this.props.gameId === gameId) {
        this.setState({ isCounting: false, hasReset: true });
        this.setState({
          team1: DEFAULT_CLOCK_TIME,
          team2: DEFAULT_CLOCK_TIME
        });
        this.clearAllTimeouts();
      }
    });

    this.props.socket.on("clock stopped", ({ gameId }) => {
      if (this.props.gameId === gameId) {
        this.clearAllTimeouts();
      }
    });
  }

  componentWillUnmount() {
    this.clearAllTimeouts();
  }

  clearAllTimeouts = () => {
    clearTimeout(this.team1Timeout);
    clearTimeout(this.team2Timeout);
    this.team1Timeout = null;
    this.team2Timeout = null;
  };

  switchClock = () => {
    const { activeTeam } = this.state;
    const nextActiveTeam = activeTeam === "team1" ? "team2" : "team1";
    clearTimeout(this[`${activeTeam}Timeout`]);
    this.setState({
      activeTeam: nextActiveTeam
    });
    this.createNewTime(nextActiveTeam);
  };

  stopClock = team => {
    this.props.socket.emit("stop clock", { gameId: this.props.gameId });
    this.setState({
      team1: "3:00",
      team2: "3:00"
    });
    const winner = team === "team1" ? "team2" : "team1";
    this.props.socket.emit("declare winner", {
      gameId: this.props.gameId,
      winner
    });
  };

  maybePrefix0 = number => {
    return number < 10 ? `0${number}` : number;
  };

  createNewTime = team => {
    const [minutes, seconds] = this.state[team].split(":").map(Number);
    const oneLessSecond = seconds - 1;
    const newSeconds = oneLessSecond < 0 ? 59 : oneLessSecond;
    const newMinutes = newSeconds === 59 ? minutes - 1 : minutes;
    if (newMinutes === 0 && newSeconds === 0) {
      this.stopClock(team);
    } else {
      this.setState({
        [team]: `${newMinutes}:${this.maybePrefix0(newSeconds)}`
      });
    }
    this[`${team}Timeout`] = setTimeout(() => this.createNewTime(team), 1000);
  };

  pauseClock = () => {
    this.props.socket.emit("pause clock", { gameId: this.props.gameId });
  };

  resumeClock = () => {
    this.props.socket.emit("resume clock", { gameId: this.props.gameId });
  };

  resetClock = () => {
    this.props.socket.emit("reset clock", { gameId: this.props.gameId });
  };

  render() {
    const { team1, team2 } = this.state;
    return (
      <div className="clock">
        <div className="timers">
          {[team1, team2].map((team, i) => {
            const isActiveTeam = `team${i + 1}` === this.state.activeTeam;
            return (
              <div className={`timer ${isActiveTeam ? "isActive" : ""}`}>
                <span>Team {i + 1}</span>
                <span>{team}</span>
              </div>
            );
          })}
        </div>
        <div className="clock-buttons">
          {this.state.isCounting && (
            <Button
              style={{ flexGrow: 1 }}
              onClick={this.pauseClock}
              size="small"
              color="gold"
            >
              Pause
            </Button>
          )}
          {!this.state.isCounting && (
            <Button
              onClick={this.resumeClock}
              size="small"
              color="green"
              style={{ borderRadius: "0 0 0 5px", width: "50%" }}
            >
              Resume
            </Button>
          )}
          {!this.state.isCounting && (
            <Button
              onClick={this.resetClock}
              size="small"
              color="blue"
              style={{ borderRadius: "0 0 5px 0", width: "50%" }}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    );
  }
}

export default Clock;
