// @flow
import React, { Component } from "react";
import socketIOClient from "socket.io-client";

class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      team1: "3:00",
      team2: "3:00",
      activeTeam: "team1",
      isCounting: false,
      hasReset: false
    };

    this.socket = socketIOClient(this.state.endpoint);

    this.socket.on("clock started", () => {
      this.setState({
        isCounting: true,
        hasReset: false
      });
      this.createNewTime(this.state.activeTeam);
    });
    this.socket.on("player changed", () => {
      this.switchClock();
    });

    this.socket.on("clock paused", () => {
      this.setState({ isCounting: false });
      clearTimeout(this.team1Timeout);
      clearTimeout(this.team2Timeout);
    });

    this.socket.on("clock reset", () => {
      this.setState({ isCounting: false, hasReset: true });
      this.setState({
        team1: "3:00",
        team2: "3:00"
      });
      clearTimeout(this.team1Timeout);
      clearTimeout(this.team2Timeout);
    });

    this.socket.on("clock stopped", () => {
      clearTimeout(this.team1Timeout);
      clearTimeout(this.team2Timeout);
      this.team1Timeout = null;
      this.team2Timeout = null;
    });
  }

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
    this.socket.emit("stop clocks");
    const winner = team === "team1" ? "team2" : "team1";
    this.socket.emit("declare winner", winner);
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
    this.socket.emit("pause clock");
  };

  resumeClock = () => {
    this.socket.emit("start clock");
  };

  resetClock = () => {
    this.socket.emit("reset clock");
  };

  render() {
    const { team1, team2 } = this.state;
    return (
      <div>
        <div>Team 1: {team1}</div>
        <div>Team 2: {team2}</div>
        {this.state.isCounting && (
          <button onClick={this.pauseClock}>Pause</button>
        )}
        {(this.state.hasReset || !this.state.isCounting) && (
          <button onClick={this.resumeClock}>Resume</button>
        )}
        {!this.state.isCounting && (
          <button onClick={this.resetClock}>Reset</button>
        )}
      </div>
    );
  }
}

export default Clock;
