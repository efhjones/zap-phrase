// @flow
import React, { Component, Fragment } from "react";
import Loading from "../common/Loading";
import Teams from "./Teams.js";
import Button from "../common/Button/Button";
import AsyncButton from "../common/Button/AsyncButton";
import ZapPhraseTitle from "./ZapPhraseTitle";

import {
  hasSufficientNumbersToPlay,
  isNameAvailable
} from "../utils/gameUtils";
import { copyText } from "../utils/utils";

import "./styles.css";

class JoinGame extends Component {
  state = {
    name: "",
    copyButtonText: "Copy",
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

  copyInviteLink = () => {
    copyText();
    this.registerCopySuccess();
  };

  registerCopySuccess = () => {
    this.toggleCopyButtonText();
    setTimeout(this.toggleCopyButtonText, 3000);
  };

  toggleCopyButtonText = () => {
    this.setState(({ copyButtonText }) => {
      const copied = "Copied!";
      return {
        copyButtonText: copyButtonText === copied ? "Copy" : copied
      };
    });
  };

  render() {
    const { state, props } = this;
    const { teams, name } = props;
    const canPlay = hasSufficientNumbersToPlay(teams);
    const { canUseName, copyButtonText } = state;
    return teams.length === 0 ? (
      <Loading />
    ) : (
      <div className="vertical-section">
        <div className="invite-link-section">
          <ZapPhraseTitle />
          <div className="invite-link-and-button">
            <p className="invite-link">{window.location.href}</p>
            <Button color="green" size="small" onClick={this.copyInviteLink}>
              {copyButtonText}
            </Button>
          </div>
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
                "Hello there! What's your name?"
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
              color="green"
              isLoading={props.isWaiting}
              type="submit"
              onClick={this.joinGame}
            >
              Join
            </AsyncButton>
          </form>
        )}
        {Boolean(props.name) && (
          <AsyncButton
            isLoading={props.isWaiting}
            disabled={!canPlay || props.isWaiting}
            color={canPlay ? "green" : "stone"}
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
