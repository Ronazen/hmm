const axios = require('axios');
module.exports.config = {
  name: 'ai',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gpt', 'openai'],
  description: "An AI command powered by GPT-4",
  usage: "Ai [promot]",
  credits: 'Developer',
  cooldown: 3,
};
module.exports.run = async function({
  api,
  event,
  args
}) {
  const input = args.join(' ');
  if (!input) {
    api.sendMessage(`🤖 𝗔𝗿𝘁𝗶𝗳𝗶𝗰𝗶𝗮𝗹 𝗶𝗻𝘁𝗲𝗹𝗹𝗶𝗴𝗲𝗻𝗰𝗲:\n\nPlease provide a question or statement!'`, event.threadID, event.messageID);
    return;
  }
  api.sendMessage(`🔍 Searching for "${input}" Please Wait...`, event.threadID, event.messageID);
  try {
    const {
      data
    } = await axios.get(`https://api-soyeon.onrender.com/api?prompt=${encodeURIComponent(input)}`);
    const response = data.response;
    api.sendMessage('💬 𝗔𝗿𝘁𝗶𝗳𝗶𝗰𝗶𝗮𝗹 𝗶𝗻𝘁𝗲𝗹𝗹𝗶𝗴𝗲𝗻𝗰𝗲:\n\n' + response + '\n\n𝗖𝗥𝗘𝗔𝗧𝗘 𝗬𝗢𝗨𝗥 𝗢𝗪𝗡 𝗕𝗢𝗧: https://heru-a45s.onrender.com', event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
