const axios = require('axios');
module.exports.config = {
  name: 'nami',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['nami', "nam"],
  description: "Asked Nami Ai",
  usage: "nami [prompt]",
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
    api.sendMessage(`🤖 𝗡𝗮𝗺𝗶\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝙿𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗 𝚖𝚢 𝚑𝚘𝚗𝚎𝚢`, event.threadID, event.messageID);
    return;
  }
  api.setMessageReaction("🟡", event.messageID, (err) => {}, true);
  api.sendMessage(`🔎 𝗡𝗮𝗺𝗶\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝 𝚠𝚑𝚒𝚕𝚎 𝙸 𝚙𝚛𝚘𝚌𝚎𝚜𝚜 𝚢𝚘𝚞𝚛 𝚛𝚎𝚚𝚞𝚎𝚜𝚝...`);
  try {
   const {
     data
   } = await axios.get(`https://openaikey-x20f.onrender.com/api?prompt=${encodeURIComponent(input)}`);
    api.setMessageReaction("🟢" , event.messageID, (err) => {}, true);
    const response = data.response;
    api.sendMessage('📝 𝗡𝗮𝗺𝗶\n\n' + response, event.threadID, event.messageID);
    } catch (error) {
    api.sendMessage('🔴 An error occurred while processing your request. Please contact Jay Mar for an error' , event.threadID, event.messageID);
    }
  };
    
