const handlers = require("./handlers.js");

class Game {
  constructor(io) {
    io.on(handlers.CONNECTION, socket => {
      socket.on(handlers.PLAYER_ADDED, ({ gameId, teams }) => {
        socket.broadcast.emit(handlers.PLAYER_ADDED, { gameId, teams });
      });

      socket.on(handlers.CATEGORY_CHANGED, ({ gameId, category }) => {
        socket.broadcast.emit(handlers.CATEGORY_CHANGED, {
          gameId,
          category
        });
      });

      socket.on(handlers.START_GAME, game => {
        this.getPlayerLineup({ game }, ({ game, playerLineup }) => {
          io.sockets.emit(handlers.GAME_STARTED, {
            game,
            phrases: game.phrases,
            playerLineup
          });
        });
      });

      socket.on(handlers.STOP_GAME, ({ game }) => {
        socket.broadcast.emit(handlers.GAME_STOPPED, { game });
      });

      socket.on(handlers.CHANGE_PLAYER, ({ gameId, nextPlayer }) => {
        io.sockets.emit(handlers.PLAYER_CHANGED, {
          gameId,
          nextPlayer
        });
      });

      socket.on(
        handlers.REMOVE_PLAYER,
        ({ gameId, playerName, playerSocketId }) => {
          io.sockets.emit(handlers.REMOVE_PLAYER, {
            gameId,
            playerName
          });
        }
      );

      socket.on(handlers.UPDATE_SOCKET_IDS, ({ allPlayers, gameId }) => {
        const playersThatDontExistInSocket = allPlayers.filter(player => {
          const connectedSockets = Object.keys(io.sockets.sockets);
          return !connectedSockets.includes(player.socketId);
        });
        if (playersThatDontExistInSocket.length > 0) {
          io.sockets.emit(handlers.REMOVE_PLAYERS, {
            players: playersThatDontExistInSocket,
            gameId
          });
        }
      });

      socket.on(
        handlers.CHANGE_PHRASE,
        ({ nextPhrase, remainingPhrases, gameId }) => {
          io.sockets.emit(handlers.PHRASE_CHANGED, {
            gameId,
            nextPhrase,
            remainingPhrases
          });
        }
      );

      socket.on(handlers.RELOAD_TEAMS, game => {
        io.sockets.emit(handlers.RELOAD_TEAMS, game);
      });

      socket.on(handlers.DECLARE_WINNER, ({ gameId, winner }) => {
        io.sockets.emit(handlers.WINNER_DECLARED, { gameId, winner });
      });

      socket.on(handlers.LOADING, ({ isLoading, gameId }) => {
        io.sockets.emit(handlers.LOADING, { isLoading, gameId });
      });

      socket.on(handlers.DISCONNECT, () => {
        const connectedSockets = Object.keys(io.sockets.sockets);
        io.sockets.emit("refresh teams", { connectedSockets });
      });
    });
  }

  onChangePlayer({ player }, done) {
    done({
      currentPlayer: player
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
}

module.exports = Game;
