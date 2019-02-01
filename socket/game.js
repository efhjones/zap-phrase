const handlers = require("./handlers.js");

class Game {
  constructor(io) {
    this.game = null;
    this.currentPlayer = null;

    io.on("connection", socket => {

      socket.on(handlers.PLAYER_ADDED, ({ teams }) => {
        socket.broadcast.emit(handlers.PLAYER_ADDED, teams);
      });

      socket.on(handlers.START_GAME, game => {
        this.onStartGame({ socket, game }, ({ game, playerLineup }) => {
          io.sockets.emit(handlers.GAME_STARTED, {
            game,
            playerLineup
          });
        });
      });

      socket.on(handlers.START_NEW_GAME, () => {
        this.onStartNewGame(null, ({ newGame }) => {
          io.sockets.emit(handlers.NEW_GAME_STARTED, newGame);
        });
      });

      socket.on(handlers.CHANGE_PLAYER, player => {
        this.onChangePlayer({ player }, ({ currentPlayer }) => {
          console.log("done, current player: ", currentPlayer);
          io.sockets.emit(handlers.PLAYER_CHANGED, currentPlayer);
        });
      });

      socket.on(handlers.CHANGE_PHRASE, phrase => {
        io.sockets.emit(handlers.PHRASE_CHANGED, phrase);
      });

      socket.on(handlers.DECLARE_WINNER, winner => {
        io.sockets.emit(handlers.WINNER_DECLARED, winner);
      });
    });
  }

  onChangePlayer({ player }, done) {
    this.currentPlayer = player;
    console.log("player in change player: ", player);
    done({
      currentPlayer: this.currentPlayer
    });
  }

  onStartGame({ socket, game }, done) {
    const { teams } = this;
    this.game = { id: socket.id, ...game };
    const [team1, team2] = teams;
    const team1Players = team1.players.slice();
    const team2Players = team2.players.slice();
    const allPlayers = team1Players.concat(team2Players);
    const playerLineup = allPlayers.reduce((lineup, _, i, allItems) => {
      //odds
      if (i % 2 === 1) {
        const playerToAdd = team2Players.shift();
        return lineup.concat(playerToAdd);
      }
      //evens
      else {
        const playerToAdd = team1Players.shift();
        return lineup.concat(playerToAdd);
      }
    }, []);
    done({
      game: this.game,
      playerLineup
    });
  }

  onStartNewGame(_, done) {
    this.currentGame = null;
    this.currentPlayer = null;
    done({
      newGame: {
        teams: this.teams,
        currentGame: this.currentGame,
        currentPlayer: this.currentPlayer
      }
    });
  }
}

module.exports = Game;
