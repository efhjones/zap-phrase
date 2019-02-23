// @flow
import React, { Component, Fragment } from "react";
import Loading from "../common/Loading";
import Teams from "./Teams.js";
import Button from "../common/Button/Button";
import AsyncButton from "../common/Button/AsyncButton";
import {
  hasSufficientNumbersToPlay,
  isNameAvailable
} from "../utils/gameUtils";

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
    const textarea = document.createElement("textarea");
    textarea.textContent = window.location.href;
    textarea.contentEditable = "true";
    textarea.readOnly = false;
    textarea.disabled = false;
    // Can't be `display: none` for `select()` to work.
    textarea.setAttribute(
      "style",
      "opacity: 0; position: fixed; top: -1000px; left: -1000px;"
    );
    // Node needs to actually be in the live DOM during copy...
    if (document.body !== null) {
      document.body.appendChild(textarea);
    }
    textarea.select();
    let didCopy = document.execCommand("copy");
    if (!didCopy) {
      // iOS-specific copying
      // Borrowed from http://bit.ly/2Gc3gTp
      const range = document.createRange();
      range.selectNodeContents(textarea);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      textarea.setSelectionRange(0, 999999);
      didCopy = document.execCommand("copy");
    }
    if (document.body !== null) {
      document.body.removeChild(textarea);
    }
    this.registerCopySuccess();
  };

  toggleCopyButtonText = () => {
    this.setState(({ copyButtonText }) => {
      const copied = "Copied!";
      return {
        copyButtonText: copyButtonText === copied ? "Copy" : copied
      };
    });
  };

  registerCopySuccess = () => {
    this.toggleCopyButtonText();
    setTimeout(this.toggleCopyButtonText, 3000);
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
          Your Game
          <div className="invite-link-and-button">
            <p className="invite-link">{window.location.href}</p>
            <Button color="blue" size="small" onClick={this.copyInviteLink}>
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
