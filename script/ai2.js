const axios = require('axios');

module.exports.config = {
  name: 'ai2',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['gpt', 'openai'],
  description: "An AI command powered by GPT-4",
  usage: "ai2 [prompt]",
  credits: 'syempre ikaw😽',
  cooldown: 3,
};

module.exports.run = async function({
  api,
  event,
  args
}) {
  const input = args.join(' ');
  if (!input) {
    api.sendMessage(`bro 

━━━━━━━━━━━━━━━

 what-,-`, event.threadID, event.messageID);
    return;
  }
  api.sendMessage(`💌𝙎𝙚𝙖𝙧𝙘𝙝𝙞𝙣𝙜
━━━━━━━━━━━━━━━━━━\n\n "${input}"`, event.threadID, event.messageID);
  try {
    const { data } = await axios.get(`https://openaikey-x20f.onrender.com/api?prompt=${encodeURIComponent(input)}`);
    const response = data.response;
    const credits = '\n';
    api.sendMessage(response + credits, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage('An error occurred while processing your request.', event.threadID, event.messageID);
  }
};
