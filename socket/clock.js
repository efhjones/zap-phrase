const handlers = require("./handlers.js");

class Clock {
  constructor(io) {
    io.on(handlers.CONNECTION, socket => {
      socket.on(handlers.START_CLOCK, ({ gameId }) => {
        console.log("in start clock handler ", gameId);
        socket.emit(handlers.CLOCK_STARTED, { gameId });
      });

      socket.on(handlers.PAUSE_CLOCK, ({ gameId }) => {
        io.sockets.emit(handlers.CLOCK_PAUSED, { gameId });
      });

      socket.on(handlers.RESUME_CLOCK, ({ gameId }) => {
        console.log("in resume clock handler ", gameId);
        io.sockets.emit(handlers.CLOCK_STARTED, { gameId });
      });

      socket.on(handlers.RESET_CLOCK, ({ gameId }) => {
        io.sockets.emit(handlers.CLOCK_RESET, { gameId });
      });

      socket.on(handlers.STOP_CLOCK, ({ gameId }) => {
        io.sockets.emit(handlers.CLOCK_STOPPED, { gameId });
      });
    });
  }
}

module.exports = Clock;
