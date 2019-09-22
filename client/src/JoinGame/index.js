// @flow
import React, { Component } from "react";
import Loading from "../common/Loading";
import Button from "../common/Button/Button";
import AsyncButton from "../common/Button/AsyncButton";

import ZapPhraseTitle from "./ZapPhraseTitle";
import Teams from "./Teams.js";
import Categories from "./Categories";

import {
  hasSufficientNumbersToPlay,
  isNameAvailable
} from "../utils/gameUtils";
import { copyText } from "../utils/utils";

import "./styles.css";

const DEFAULT_COPY_TEXT = "Copy Invite Link";

class JoinGame extends Component {
  state = {
    name: "",
    copyButtonText: DEFAULT_COPY_TEXT,
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

  joinGame = e => {
    e.preventDefault();
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
    setTimeout(this.toggleCopyButtonText, 1500);
  };

  toggleCopyButtonText = () => {
    this.setState(({ copyButtonText }) => {
      const copied = "Copied!";
      return {
        copyButtonText: copyButtonText === copied ? DEFAULT_COPY_TEXT : copied
      };
    });
  };

  render() {
    const { state, props } = this;
    const { teams, name, category } = props;
    const canPlay = hasSufficientNumbersToPlay(teams);
    const { canUseName, copyButtonText } = state;
    return teams.length === 0 ? (
      <Loading />
    ) : (
      <>
        <ZapPhraseTitle />
        <div className="vertical-section">
          <div className="invite-and-join-section">
            <div className="invite-link-section">
              <div className="invite-link-and-button">
                <Button color="green" onClick={this.copyInviteLink}>
                  {copyButtonText}
                </Button>
              </div>
            </div>
            <div className="join-game-section">
              {!props.name && (
                <form className="join-game-form" id="join-game-form">
                  <input
                    aria-label={
                      canUseName ? "input name" : "invalid name, already taken."
                    }
                    id="name-field"
                    className="name-field"
                    type="text"
                    value={state.name}
                    onChange={this.updateName}
                    placeholder="Name, please!"
                  />
                  <AsyncButton
                    disabled={
                      state.name.length === 0 || props.isWaiting || !canUseName
                    }
                    color="green"
                    isLoading={props.isWaiting}
                    type="submit"
                    onClick={this.joinGame}
                    size="small"
                    style={{ width: "100%" }}
                  >
                    {!canUseName ? "Sorry, that name’s taken." : "Join"}
                  </AsyncButton>
                </form>
              )}
              {Boolean(props.name) && (
                <AsyncButton
                  isLoading={props.isWaiting}
                  disabled={!canPlay || props.isWaiting}
                  color={canPlay ? "green" : "stone"}
                  onClick={() => props.startGame(this.state.category)}
                >
                  {canPlay ? "start" : "need moar players"}
                </AsyncButton>
              )}
            </div>
          </div>
          <Categories
            onSelectCategory={props.onSelectCategory}
            category={category}
          />
          <div className="current-players">
            <Teams teams={teams} name={name} />
          </div>
        </div>
      </>
    );
  }
}

export default JoinGame;
