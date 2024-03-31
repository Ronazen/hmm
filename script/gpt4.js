const { RsnChat } = require("rsnchat");

const rsnchat = new RsnChat("rsnai_q6XwhE3xUtjjW3SwxiO5xq9o");

module.exports.config = {
		name: "gpt4",
		version: "1.0.0",
		role: 0,
	  aliases: ["Gpt4"],
		credits: "cliff",
		hasPrefix: false,
		description: "Ask GPT-4 a question.",
		usage: "<question>",
		cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
		const question = args.join(" ");
		if (!question) return api.sendMessage("🤖 𝗣𝗵𝗼𝗻𝗸𝗚𝗽𝘁4\n\n𝙿𝚕𝚎𝚊𝚜𝚎 𝚙𝚛𝚘𝚟𝚒𝚍𝚎 𝚊 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗 𝚘𝚛 𝚜𝚝𝚊𝚝𝚎𝚖𝚎𝚗𝚝!.", event.threadID);
      api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
		rsnchat.gpt(question).then((response) => {
				api.sendMessage('🤖 𝗣𝗵𝗼𝗻𝗸𝗚𝗽𝘁4\n\n' + response.message, event.threadID);
      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
		}).catch((error) => {
				api.sendMessage("An error occurred while processing your request.", event.threadID);
				console.error(error);
      api.setMessageReaction("❎", event.messageID, (err) => {}, true);
		});
};
