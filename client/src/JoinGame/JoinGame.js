// @flow
import React, { useState } from "react";
import Loading from "../common/Loading";
import Button from "../common/Button/Button";
import AsyncButton from "../common/Button/AsyncButton";

import ZapPhraseTitle from "./components/ZapPhraseTitle";
import Teams from "./components/teams/Teams";
import Categories from "./components/categories/Categories";

import {
  hasSufficientNumbersToPlay,
  isNameAvailable
} from "../utils/gameUtils";
import { copyText } from "../utils/utils";

import "./JoinGame.css";

const DEFAULT_COPY_TEXT = "Copy Invite Link";

const JoinGame = ({ teams, category, joinGame, ...props }) => {
  const [name, setName] = useState(props.name || "");
  const [copyButtonText, setCopyButtonText] = useState(DEFAULT_COPY_TEXT);
  const canPlay = hasSufficientNumbersToPlay(teams);
  const canUseName = name === "" || isNameAvailable(teams, name);

  return teams.length === 0 ? (
    <Loading />
  ) : (
    <>
      <ZapPhraseTitle />
      <div className="vertical-section">
        <div className="invite-and-join-section">
          <div className="invite-link-section">
            <div className="invite-link-and-button">
              <Button
                color="green"
                onClick={() => {
                  copyText();
                  setCopyButtonText("Copied!");
                  setTimeout(() => setCopyButtonText(DEFAULT_COPY_TEXT), 1500);
                }}
              >
                {copyButtonText}
              </Button>
            </div>
          </div>
          <div className="join-game-section">
            {!props.name && (
              <form className="join-game-form" id="join-game-form">
                <label
                  className={`name-label vertical-section ${!canUseName &&
                    "validation-failed"}`}
                >
                  {!canUseName && (
                    <>
                      <span>Sorry, that name’s taken.</span>
                      <span>Choose another?</span>
                    </>
                  )}
                  <input
                    className="name-field"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Hello there! What's your name?"
                  />
                </label>
                <AsyncButton
                  disabled={name.length === 0 || props.isWaiting || !canUseName}
                  color="green"
                  isLoading={props.isWaiting}
                  type="submit"
                  onClick={e => {
                    e.preventDefault();
                    joinGame(name);
                  }}
                  size="small"
                  style={{ width: "100%" }}
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
                onClick={() => props.startGame(category)}
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
};

export default JoinGame;
