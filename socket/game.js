const handlers = require("./handlers.js");

class Game {
  constructor(io) {
    this.game = null;
    this.currentPlayer = null;

    io.on("connection", socket => {
      socket.on(handlers.PLAYER_ADDED, game => {
        socket.broadcast.emit(handlers.PLAYER_ADDED, game);
      });

      socket.on("start game", game => {
        this.getPlayerLineup({ game }, ({ game, playerLineup }) => {
          io.sockets.emit(handlers.GAME_STARTED, {
            game,
            playerLineup
          });
        });
      });

      socket.on(handlers.STOP_GAME, ({ game }) => {
        socket.broadcast.emit(handlers.GAME_STOPPED, { game });
      });

      socket.on(handlers.START_NEW_GAME, () => {
        this.onStartNewGame(null, ({ newGame }) => {
          io.sockets.emit(handlers.NEW_GAME_STARTED, newGame);
        });
      });

      socket.on(handlers.CHANGE_PLAYER, player => {
        this.onChangePlayer({ player }, ({ currentPlayer }) => {
          io.sockets.emit(handlers.PLAYER_CHANGED, currentPlayer);
        });
      });

      socket.on(handlers.CHANGE_PHRASE, ({ nextPhrase, remainingPhrases }) => {
        io.sockets.emit(handlers.PHRASE_CHANGED, {
          nextPhrase,
          remainingPhrases
        });
      });

      socket.on(handlers.DECLARE_WINNER, winner => {
        io.sockets.emit(handlers.WINNER_DECLARED, winner);
      });

      socket.on("loading", ({ isLoading, gameId }) => {
        io.sockets.emit("loading", { isLoading, gameId });
      });
    });
  }

  onChangePlayer({ player }, done) {
    this.currentPlayer = player;
    done({
      currentPlayer: this.currentPlayer
    });
  }

  getPlayerLineup({ game }, done) {
    const { teams } = game;
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
      game,
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
