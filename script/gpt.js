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

  if (!question) return sendMessage("🤖 𝗣𝗵𝗼𝗻𝗸𝗚𝗽𝘁\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗 .");
    api.setMessageReaction("🔎", event.messageID, (err) => {}, true);
  try {
    const response = await get(`${url}?question=${encodeURIComponent(question)}`);
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
    sendMessage('🤖 𝗣𝗵𝗼𝗻𝗸𝗚𝗽𝘁\n\n' + response.data.reply);
  } catch (error) {
    sendMessage("⚠️ | Error! Please Contact the Developer for an Error\n\n-fblink: https://www.facebook.com/jaymar.dev.00" + error.message);
    api.setMessageReaction("⚠️", event.messageID, (err) => {}, true);
  }
};
                           
