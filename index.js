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

const requestListener = function (req, res) {
  res.writeHead(200);
  res.end('Hello, World!');
}

// https or http based on env
let server;
if (process.env.NODE_ENV === 'production') {
  const options = letsencryptOptions(process.env.HOSTNAME);
  server = require("https").createServer(options, requestListener);
} else {
  server = require("http").createServer(requestListener);
}


const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

// assign a random color to each socket
let colorIndex = 0;
const colors = [
  '#9400d3',
  '#4b0082',
  '#0000ff',
  '#00ff00',
  '#ffff00',
  '#ff7f00',
  '#ff0000',
];
const getNextColor = () => {
  // const color = colors[colorIndex];
  colorIndex = (colorIndex + 1) % colors.length;
  return colorIndex;
};

require('./twitch.js')((message) => {
  io.emit("twitch", message);
  io.emit("addBox", {
    key: '123',
    timerDuration: '',
    title: message});
});

io.on("connection", socket => {
  console.log("User connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
  
  socket.color = getNextColor();
  
  // drag and drop
  socket.on("moveBox", (message) => {
    console.log("moveBox", message);
    socket.broadcast.emit("moveBox", message);
  });

  socket.on("addBox", (message) => {
    console.log("addBox: ", message);
    socket.broadcast.emit("addBox", message);
  });

  socket.on("deleteBox", (message) => {
    console.log("deleteBox: ", message);
    socket.broadcast.emit("deleteBox", message);
  });


  // cursor share
  socket.on("cursor", (message) => {
    console.log("cursor: ", message);
    
    // socket.broadcast.emit("cursor", {...message, id: socket.id, color: socket.color});
    io.emit("cursor", {...message, id: socket.id, color: socket.color});
  });
});

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
