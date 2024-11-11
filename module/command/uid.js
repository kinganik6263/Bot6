const fs = require("fs-extra");
const request = require("request");

module.exports.config = {
  name: "uid",
  version: "1.0.0",
  permission: 0, // Permission 0 means all users can use this command
  credits: "Nayan",
  description: "Get user ID and profile picture.",
  prefix: true,
  category: "info",
  usages: "/uid",
  cooldowns: 5,
};

module.exports.run = async ({ api, event, args }) => {
  let uid, name;

  // Check if the command is replying to a message
  if (event.type === "message_reply") {
    uid = event.messageReply.senderID;
  } 
  // Check if the user is mentioned
  else if (args.join(" ").indexOf("@") !== -1) {
    uid = Object.keys(event.mentions)[0];
  } 
  // If no reply or mention, use the sender's ID
  else {
    uid = event.senderID;
  }

  try {
    const userInfo = await api.getUserInfo(uid);
    name = userInfo[uid].name || "Unknown User";

    // Ensure cache directory exists
    const cacheDir = __dirname + "/cache";
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }

    // URL for profile picture
    const profilePicUrl = `https://graph.facebook.com/${uid}/picture?height=1500&width=1500&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

    // Download and send profile picture with UID details
    const filePath = cacheDir + "/uid_profile.png";
    request(profilePicUrl)
      .pipe(fs.createWriteStream(filePath))
      .on("close", () => {
        api.sendMessage(
          {
            body: `=== [ 𝗨𝗜𝗗 𝗨𝗦𝗘𝗥 ] ====\n━━━━━━━━━━━━━━━━━━\n[ ▶️]➜ Name: ${name}\n[ ▶️]➜ 𝗜𝗗: ${uid}\n[ ▶️]➜ 𝗜𝗕: m.me/${uid}\n[ ▶️]➜ 𝗟𝗶𝗻𝗸𝗙𝗕: https://www.facebook.com/profile.php?id=${uid}\n━━━━━━━━━━━━━━━━━━`,
            attachment: fs.createReadStream(filePath),
          },
          event.threadID,
          () => fs.unlinkSync(filePath),
          event.messageID
        );
      });
  } catch (error) {
    console.error("Error fetching user info:", error);
    api.sendMessage("দুঃখিত, ইউজারের তথ্য আনতে সমস্যা হচ্ছে!", event.threadID);
  }
};