// Modules requir

const login = require("priyanshu-fca")
const fs = require("fs");
const path = require("path");
const moment = require('moment-timezone'); // Moment time zone package to convert to Bangladesh time

// main.js

global.nodemodule = {}; // global.nodemodule অবজেক্ট তৈরি করা হলো

// এখানে প্যাকেজগুলি লোড করুন
global.nodemodule.request = require('request'); 
global.nodemodule.request = require('fs-extra'); 

// Load config file
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const prefix = config.PREFIX; // fallback to "!" if prefix is not set
global.config = config;

// Load appstate token from appstade.json
const appState = JSON.parse(fs.readFileSync("appstade.json", "utf8"));

// Initialize empty arrays for commands and events
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

  // Log each command file name after login
  commandFiles.forEach(file => {
    const command = require(path.join(commandPath, file));
    console.log(`Loaded command: ${command.config.name}`);
  });
  
  console.log(`Total commands loaded: ${commandFiles.length}`); // মোট কমান্ড সংখ্যা দেখাবে

console.log("==================================================") 
  console.log("version: 1.0.0")
  console.log("bot-owner: Mohammad Anik")
  console.log("Facebook: https://www.facebook.com/profile.php?id=100001453534533")
  console.log("Don't spam don't change credits enjoy the bot ☺️")
  
  console.log("==================================================")
   

  console.log(" ▗▄▖ ▗▖  ▗▖▗▄▄▄▖▗▖ ▗▖    ▗▄▄▖  ▗▄▖▗▄▄▄▖");
  console.log("▐▌ ▐▌▐▛▚▖▐▌  █  ▐▌▗▞▘    ▐▌ ▐▌▐▌ ▐▌ █  ");
  console.log("▐▛▀▜▌▐▌ ▝▜▌  █  ▐▛▚▖     ▐▛▀▚▖▐▌ ▐▌ █  ");
  console.log("▐▌ ▐▌▐▌  ▐▌▗▄█▄▖▐▌ ▐▌    ▐▙▄▞▘▝▚▄▞▘ █  ");
  console.log("Bot is starting...");

  // Listen for messages
  api.listenMqtt((err, event) => {
    if (err) return console.error(err);

    // Check if the message starts with the prefix from config
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
      const userID = event.senderID; // User ID who sent the message
      const threadID = event.threadID; // Group ID where the message was sent

      // Get the current time in Bangladesh timezone using moment-timezone
      
      
      const moment = require('moment-timezone');

// নিশ্চিত হতে timestamp কে সংখ্যা হিসেবে গুন করা হচ্ছে কি না।
const messageTime = moment.tz(parseInt(event.timestamp), 'Asia/Dhaka').format('hh:mm:ss A'); 

      // Bangladesh time
      const botName = config.BOTNAME; // Bot's name from config

      // Fetch user's name (optional: you can also fetch full name if required)
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