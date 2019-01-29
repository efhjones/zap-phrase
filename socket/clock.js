const handlers = require("./handlers.js");

class Clock {
  constructor(io) {
    io.on("connection", socket => {
      socket.on(handlers.START_CLOCK, () => {
        socket.emit(handlers.CLOCK_STARTED);
      });

      socket.on(handlers.PAUSE_CLOCK, () => {
        io.sockets.emit(handlers.CLOCK_PAUSED);
      });

      socket.on(handlers.RESUME_CLOCK, () => {
        io.sockets.emit(handlers.CLOCK_STARTED);
      });

      socket.on(handlers.RESET_CLOCK, () => {
        io.sockets.emit(handlers.CLOCK_RESET);
      });

      socket.on(handlers.STOP_CLOCK, () => {
        io.sockets.emit(handlers.CLOCK_STOPPED);
      });
    });
  }
}

module.exports = Clock;
