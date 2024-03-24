const axios = require('axios');

module.exports.config = {
  name: 'jonnysins',
  version: '1.0.0',
  role: 0,
  hasPrefix: false,
  aliases: ['jonny', "sins", "jon"],
  description: 'Ask Jonny Sins',
  usage: 'jonny [prompt]',
  credits: 'Developer',
  cooldown: 3,
};

module.exports.run = async function ({ api, event, args, message }) {
 try {
  const prompt = event.body.trim();
   if (!prompt) {
     api.sendMessage({body: "Hey I am Jonny Sins, ask me questions dear 🤖"});
     return;
   }
   api.setMessageReaction("🔎" , event.messageID, (err) => {}, true);
   const response = await axios.get(`https://sandipapi.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
   api.setMessageReaction("✅" , event.messageID, (err) => {}, true);
   const answer = response.data.answer;

   await api.sendMessage({
     body: `𝗝𝗼𝗻𝗻𝘆𝗦𝗶𝗻𝘀 | 🧏 ━━━━━━━━━━━━━━━━━━
  ${answer}
━━━━━━━━━━━━━━━━━━\n\n- 𝚃𝚑𝚒𝚜 𝚋𝚘𝚝 𝚞𝚗𝚍𝚎𝚛 𝙳𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚍 𝚋𝚢 𝙹𝚊𝚢𝚖𝚊𝚛\n• 𝐅𝐛𝐥𝐢𝐧𝐤: >>https://www.facebook.com/jaymar.dev.00<<`,
   }, event.threadID);
   
  } catch (error) {
   console.error("🔴 an error occurred while processing your request. Please contact Jay Mar for an error");
   api.setMessageReaction("🔴" , event.messageID, (err) => {}, true);
 }
  };
