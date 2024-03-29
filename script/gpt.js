const { get } = require('axios');

module.exports.config = {
  name: 'gpt',
  credits: "cliff",
  version: '1.0.0',
  role: 0,
  aliases: ["Gpt"],
  cooldown: 0,
  hasPrefix: false,
  usage: "",
};

module.exports.run = async function ({ api, event, args }) {
  const question = args.join(' ');
  function sendMessage(msg) {
    api.sendMessage(msg, event.threadID, event.messageID);
  }

  const url = "https://hercai.onrender.com/v3/hercai";

  if (!question) return sendMessage("🤖 𝗖𝗵𝗮𝘁𝗚𝗽𝘁\n\nPlease provide a question.");

  try {
    const response = await get(`${url}?question=${encodeURIComponent(question)}`);
    sendMessage('🤖 𝗖𝗵𝗮𝘁𝗚𝗽𝘁\n\n' + response.data.reply);
  } catch (error) {
    sendMessage("An error occurred: " + error.message);
  }
};
