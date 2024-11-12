const login = require('fca-priyansh');  // Facebook Chat API
const config = require('./config.json');  // Config ফাইল থেকে ডাটা পড়া
const moment = require('moment-timezone'); // সময়ের জন্য moment লাইব্রেরি

// কনফিগারেশন থেকে বটের নাম সেট করা
const botName = config.BOTNAME || 'My Bot';

// বাংলাদেশ সময় সেট করার জন্য
function getBangladeshTime() {
  return moment().tz('Asia/Dhaka').format('YYYY-MM-DD HH:mm:ss');
}

// লগইন ফাংশন
login({ appState: JSON.parse(require('fs').readFileSync('./appstade.json', 'utf8')) }, (err, api) => {
  if (err) {
    console.error("Login failed:", err);
    return;
  }

  console.log(`${botName} is now online!`);

  // মেসেজ ইভেন্ট হ্যান্ডল করার জন্য
  api.listenMqtt((err, event) => {
    if (err) {
      console.error("Listen error:", err);
      return;
    }

    const messageTime = getBangladeshTime();
    const threadID = event.threadID;
    const userID = event.senderID;

    if (event.type === 'message' && event.body) {
      // try-catch ব্লক ব্যবহার করে ত্রুটি হ্যান্ডল করা হচ্ছে
      try {
        api.getUserInfo(userID, (err, userInfo) => {
          if (err) {
            console.error("Error getting user info:", err);
            return;
          }

          const userName = userInfo[userID] ? userInfo[userID].name : "Unknown User";

          console.log("==================================================");
          console.log(`Message received in group ${threadID}\nfrom user ${userName} (ID: ${userID})`);
          console.log(`Message: "${event.body}"`);
          console.log(`Time (Bangladesh): ${messageTime}`);
          console.log(`Bot Name: ${botName}`);
          console.log("==================================================");

          // Command বা message অনুযায়ী বটের response দেওয়া
          if (event.body.toLowerCase() === 'hello') {
            api.sendMessage(`Hello ${userName}!`, threadID);
          } else if (event.body.toLowerCase() === `${config.PREFIX}time`) {
            api.sendMessage(`Bangladesh Time: ${messageTime}`, threadID);
          } else {
            api.sendMessage("Command not recognized.", threadID);
          }
        });
      } catch (error) {
        console.error("An error occurred in
