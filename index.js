require('dotenv').config();
var path = require('path');
var fs = require('fs');
const PORT = process.env.PORT || 4000;

function letsencryptOptions(domain) {
  const path = '/etc/letsencrypt/live/';
  console.log(path + domain + '/privkey.pem');
  return {
    key: fs.readFileSync(path + domain + '/privkey.pem'),
    cert: fs.readFileSync(path + domain + '/cert.pem'),
    ca: fs.readFileSync(path + domain + '/chain.pem')
  };
}

// https or http based on env
let server;
if (process.env.NODE_ENV === 'production') {
  const options = letsencryptOptions(process.env.HOSTNAME);
  server = require("https").createServer();
} else {
  server = require("http").createServer();
}


const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

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
