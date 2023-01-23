require('dotenv').config();
const server = require("http").createServer();

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

const PORT = process.env.PORT || 4000;

io.on("connection", socket => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  
  socket.on("moveBox", (message) => {
    console.log("moveBox", message);
    io.emit("moveBox", message);
  });

  socket.on("addBox", (message) => {
    console.log("addBox: ", message);
    io.emit("addBox", message);
  });

  socket.on("deleteBox", (message) => {
    console.log("deleteBox: ", message);
    io.emit("deleteBox", message);
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
