// Welcome event functionality
module.exports.run = async ({ api, event }) => {
  const { threadID, logMessageData } = event;

  // Checking if the event is a group join event
  if (event.logMessageType === "log:subscribe") {
    const newUser = logMessageData.addedParticipants[0].fullName;
    api.sendMessage(`স্বাগতম, ${newUser}! আমাদের গ্রুপে আপনাকে স্বাগতম।`, threadID);
  }
};

module.exports.config = {
  event: "welcome",
  description: "নতুন ইউজার এলে স্বাগতম জানায়",
  enabled: true
};