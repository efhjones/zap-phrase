// @flow
import React, { Component, Fragment } from "react";
import Loading from "../common/Loading";
import Teams from "./Teams.js";
import AsyncButton from "../common/Button/AsyncButton";
import {
  hasSufficientNumbersToPlay,
  isNameAvailable
} from "../utils/gameUtils";

import "./styles.css";

class JoinGame extends Component {
  state = {
    name: "",
    canUseName: true
  };

  updateName = event => {
    const name = event.target.value;
    const canUseName = isNameAvailable(this.props.teams, name);
    this.setState({
      name,
      canUseName
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
    const { canUseName } = state;
    return teams.length === 0 ? (
      <Loading />
    ) : (
      <div className="vertical-section">
        <div className="invite-link">
          <span>Invite others to your game with this link:</span>
          <span>{window.location.href}</span>
        </div>
        <div className="current-players">
          <Teams teams={teams} name={name} />
        </div>
        {!props.name && (
          <form className="vertical-section">
            <label
              className={`name-label vertical-section ${!canUseName &&
                "validation-failed"}`}
            >
              {!canUseName ? (
                <Fragment>
                  <span>Sorry, that name’s taken.</span>
                  <span>Choose another?</span>
                </Fragment>
              ) : (
                "What’s your name, friend?"
              )}
              <input
                className="name-field"
                type="text"
                value={state.name}
                onChange={this.updateName}
              />
            </label>
            <AsyncButton
              disabled={
                state.name.length === 0 || props.isWaiting || !canUseName
              }
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
