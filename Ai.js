const axios = require('axios');

module.exports.config = {
 name: "luci",
 version: "1.0.0",
 role: 0,
 aliases: ["lu", "ci"],
 credits: "cliff",//modified by Jaymar
cooldown: 0,
hasPrefix: false,
	usage: "",
};

module.exports.run = async function ({ api, event, args }) {
 const content = encodeURIComponent(args.join(" "));

 if (!content) {
	return api.sendMessage("🤖 𝗥𝗮𝘃𝗲𝗻𝗟𝘂𝗰𝗶\n━━━━━━━━━━━━━━━━━━\n\n𝙷𝚎𝚕𝚕𝚘 👋, 𝙰𝚜𝚔 𝚖𝚎 𝚊𝚗𝚢𝚝𝚑𝚒𝚗𝚐.", event.threadID, event.messageID);
 }
  api.setMessageReaction("⌛", event.messageID, (err) => {}, true);

 api.sendMessage("🔎 | 𝐒𝐞𝐚𝐫𝐜𝐡𝐢𝐧𝐠 𝐲𝐨𝐮𝐫 𝐪𝐮𝐞𝐫𝐲 𝐩𝐥𝐞𝐚𝐬𝐞 𝐰𝐚𝐢𝐭", event.threadID, event.messageID); 

 const apiUrl = `https://bluerepoapislasttry.onrender.com/hercai?content=${content}`;
  
 api.setMessageReaction("✅", event.messageID, (err) => {}, true);
  
 try {
	const response = await axios.get(apiUrl);
	const reply = response.data.reply;

	api.sendMessage('💬 𝗥𝗮𝘃𝗲𝗻𝗟𝘂𝗰𝗶\n\n━━━━━━━━━━━━━━━━━━\n' + reply, event.threadID, event.messageID);
 } catch (error) {
	console.error("Error fetching data:", error.message);
	api.sendMessage("⚠️ | 𝙰𝚗 𝚎𝚛𝚛𝚘𝚛 𝚘𝚌𝚌𝚞𝚛𝚛𝚎𝚍 𝚙𝚕𝚎𝚊𝚜𝚎 𝚌𝚘𝚗𝚝𝚊𝚌𝚝 𝚝𝚑𝚎 𝚍𝚎𝚟𝚎𝚕𝚘𝚙𝚎𝚛 𝚏𝚘𝚛 𝚊𝚗 𝚎𝚛𝚛𝚘𝚛.\n\n- 𝙵𝚋𝚕𝚒𝚗𝚔:https://www.facebook.com/jaymar.dev.00", event.threadID);
   api.setMessageReaction("⚠️", event.messageID, (err) => {}, true);
 }
};
			
