// @flow
import React, { Component } from "react";

import { SocketConsumer } from "../SocketContext/SocketContextProvider.js";
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

  maybePrefix0 = number => {
    return number < 10 ? `0${number}` : number;
  };

  render() {
    const { team1, team2 } = this.state;
    const { gameId: thisGameId } = this.props;
    return (
      <SocketConsumer>
        {({
          socket,
          currentPlayer,
          currentPhrase,
          remainingPhrases,
          nextPlayer,
          winner,
          setCurrentPhrase,
          setNextPlayer
        }) => {
          this.pauseClock = () => {
            socket.emit("pause clock", {
              gameId: thisGameId
            });
          };

          this.resumeClock = () => {
            socket.emit("resume clock", {
              gameId: thisGameId
            });
          };

          this.resetClock = () => {
            socket.emit("reset clock", {
              gameId: thisGameId
            });
          };

          this.switchClock = () => {
            const { activeTeam } = this.state;
            const nextActiveTeam = activeTeam === "team1" ? "team2" : "team1";
            clearTimeout(this[`${activeTeam}Timeout`]);
            this.setState({
              activeTeam: nextActiveTeam
            });
            this.createNewTime(nextActiveTeam);
          };

          this.stopClock = team => {
            socket.emit("stop clock", { gameId: thisGameId });
            this.setState({
              team1: "3:00",
              team2: "3:00"
            });
            const winner = team === "team1" ? "team2" : "team1";
            socket.emit("declare winner", {
              gameId: thisGameId,
              winner
            });
          };

          this.createNewTime = team => {
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
            this[`${team}Timeout`] = setTimeout(
              () => this.createNewTime(team),
              1000
            );
          };

          socket.on("clock started", ({ gameId }) => {
            debugger;
            if (thisGameId === gameId) {
              this.setState({
                isCounting: true,
                hasReset: false
              });
              this.createNewTime(this.state.activeTeam);
            }
          });

          socket.on("player changed", ({ gameId }) => {
            if (gameId === thisGameId) {
              this.switchClock();
            }
          });

          socket.on("clock paused", ({ gameId }) => {
            if (thisGameId === gameId) {
              this.setState({ isCounting: false });
              clearTimeout(this.team1Timeout);
              clearTimeout(this.team2Timeout);
            }
          });

          socket.on("clock reset", ({ gameId }) => {
            if (thisGameId === gameId) {
              this.setState({ isCounting: false, hasReset: true });
              this.setState({
                team1: DEFAULT_CLOCK_TIME,
                team2: DEFAULT_CLOCK_TIME
              });
              this.clearAllTimeouts();
            }
          });

          socket.on("clock stopped", ({ gameId }) => {
            if (thisGameId === gameId) {
              this.clearAllTimeouts();
            }
          });

          return (
            <div className="clock">
              <div className="timers">
                {[team1, team2].map((team, i) => {
                  const isActiveTeam = `team${i + 1}` === this.state.activeTeam;
                  return (
                    <div
                      className={`timer ${isActiveTeam ? "isActive" : ""}`}
                      key={"team" + i}
                    >
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
        }}
      </SocketConsumer>
    );
  }
}

export default Clock;
