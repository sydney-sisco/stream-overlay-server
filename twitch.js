const tmi = require('tmi.js');
require('dotenv').config();

const USERNAME = process.env.USERNAME;
const OAUTH_TOKEN = process.env.OAUTH_TOKEN;
const CHANNEL_NAME = process.env.CHANNEL_NAME;

// Define configuration options
const opts = {
  identity: {
    username: USERNAME,
    password: OAUTH_TOKEN,
  },
  channels: [
    CHANNEL_NAME,
  ]
};

const twitch = (cb) => {
  // Create a client with our options
  const client = new tmi.client(opts);

  // Register our event handlers (defined below)
  client.on('message', onMessageHandler);
  client.on('connected', onConnectedHandler);

  // Connect to Twitch:
  client.connect();

  // Called every time a message comes in
  function onMessageHandler(target, context, msg, self) {
    if (self) { return; } // Ignore messages from the bot

    // call the callback function with the message
    cb(msg);
    // messages.push(msg.trim());
  }

  // Called every time the bot connects to Twitch chat
  function onConnectedHandler(addr, port) {
    console.log(`* Connected to ${addr}:${port}`);
  }
}

module.exports = twitch;