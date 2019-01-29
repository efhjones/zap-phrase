const { createRoomId } = require("./utils.js");

const roomId = createRoomId();

class Entry {
  constructor(io) {
    io.on("connection", socket => {
      socket.emit("new room", roomId);

      socket.on("join room", roomId => {});
    });
  }
}

module.exports = Entry;
