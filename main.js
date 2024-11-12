// Modules required
const login = require("fca-priyansh");
const fs = require("fs");
const path = require("path");
const moment = require('moment-timezone');

// Main.js

global.nodemodule = {};

// Load packages
global.nodemodule.request = require('request'); 
global.nodemodule.request = require('fs-extra'); 

// Load config file
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const prefix = config.PREFIX;
global.config = config;

// Load appstate token from appstade.json
const appState = JSON.parse(fs.readFileSync("appstade.json", "utf8"));

// Initialize commands and events
const commands = new Map();
const events = [];

// Load all command files
const commandPath = path.join(__dirname, "module", "command");
const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith(".js"));
commandFiles.forEach(file => {
  const command = require(path.join(commandPath, file));
  commands.set(command.config.name, command);
});

// Load all event files
const eventPath = path.join(__dirname, "module", "event");
fs.readdirSync(eventPath).forEach(file => {
  if (file.endsWith(".js")) {
    const event = require(path.join(eventPath, file));
    events.push(event);
  }
});

// Login with FCA unofficial
login({ appState }, (err, api) => {
  if (err) return console.error("Login failed!", err);

  console.log("Bot successfully logged in!");

  commandFiles.forEach(file => {
    const command = require(path.join(commandPath, file));
    console.log(`Loaded command: ${command.config.name}`);
  });
  
  console.log(`Total commands loaded: ${commandFiles.length}`);

  console.log("=================================================="); 
  console.log("version: 1.0.0");
  console.log("bot-owner: Mohammad Anik");
  console.log("Facebook: https://www.facebook.com/profile.php?id=100001453534533");
  console.log("Don't spam, don't change credits, enjoy the bot ☺️");
  console.log("==================================================");
   
  console.log(" ▗▄▖ ▗▖  ▗▖▗▄▄▄▖▗▖ ▗▖    ▗▄▄▖  ▗▄▖▗▄▄▄▖");
  console.log("▐▌ ▐▌▐▛▚▖▐▌  █  ▐▌▗▞▘    ▐▌ ▐▌▐▌ ▐▌ █  ");
  console.log("▐▛▀▜▌▐▌ ▝▜▌  █  ▐▛▚▖     ▐▛▀▚▖▐▌ ▐▌ █  ");
  console.log("▐▌ ▐▌▐▌  ▐▌▗▄█▄▖▐▌ ▐▌    ▐▙▄▞▘▝▚▄▞▘ █  ");
  console.log("Bot is starting...");

  // Listen for messages
  api.listenMqtt((err, event) => {
    if (err) return console.error(err);

    if (event.body && event.body.startsWith(prefix)) {
      const args = event.body.slice(prefix.length).trim().split(" ");
      const commandName = args.shift().toLowerCase();

      const command = commands.get(commandName);
      if (command) {
        try {
          command.run({ api, event, args });
        } catch (error) {
          console.error(`Error executing command ${commandName}:`, error);
        }
      } else {
        api.sendMessage("command khoje pawa jacche na", event.threadID);
      }
    }

    // Log message details when a user sends a message in a group
    if (event.body) {
      const userID = event.senderID;
      const threadID = event.threadID;

      // Get the current time in Bangladesh timezone
      const messageTime = moment.tz(parseInt(event.timestamp), 'Asia/Dhaka').format('hh:mm:ss A');

      // Bot name from config
      const botName = config.BOTNAME;

      // Fetch user's name
      api.getUserInfo(userID, (err, userInfo) => {
        if (err) return console.error("Error getting user info:", err);

        const userName = userInfo[userID] ? userInfo[userID].name : "Unknown User";

        console.log("==================================================");
        console.log(`Message received in group ${threadID}\nfrom user ${userName} (ID: ${userID})`);
        console.log(`Message: "${event.body}"`);
        console.log(`Time (Bangladesh): ${messageTime}`);
        console.log(`Bot Name: ${botName}`);
        console.log("==================================================");
      });
    }
  });
});
