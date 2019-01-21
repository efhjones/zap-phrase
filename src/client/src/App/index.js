import React, { Component } from "react";

import Game from "../Game";

import "./styles.css";

class App extends Component {
  render() {
    return (
      <main className="container">
        <Game />
      </main>
    );
  }
}

export default App;
