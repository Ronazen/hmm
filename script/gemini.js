module.exports.config = {
	name: "gemini",
	role: 0,
	credits: "Deku", //https://facebook.com/joshg101
	description: "Talk to Gemini (conversational)",
	hasPrefix: false,
	version: "5.6.7",
	aliases: ["bard"],
	usage: "gemini [prompt]"
};

module.exports.run = async function ({ api, event, args }) {
	const axios = require("axios");
	let prompt = args.join(" "),
		uid = event.senderID,
		url;
	if (!prompt) return api.sendMessage(`Please enter a prompt.`, event.threadID);
	api.sendTypingIndicator(event.threadID);
	try {
		const geminiApi = `https://gemini-api.replit.app`;
		if (event.type == "message_reply") {
			if (event.messageReply.attachments[0]?.type == "photo") {
				url = encodeURIComponent(event.messageReply.attachments[0].url);
				const res = (await axios.get(`${geminiApi}/gemini?prompt=${prompt}&url=${url}&uid=${uid}`)).data;
				return api.sendMessage(res.gemini, event.threadID);
			} else {
				return api.sendMessage('Please reply to an image.', event.threadID);
			}
		}
		const response = (await axios.get(`${geminiApi}/gemini?prompt=${prompt}&uid=${uid}`)).data;
		return api.sendMessage(response.gemini, event.threadID);
	} catch (error) {
		console.error(error);
		return api.sendMessage('❌ | 𝘼𝙣 𝙚𝙧𝙧𝙤𝙧 𝙤𝙘𝙘𝙪𝙧𝙧𝙚𝙙. 𝙔𝙤𝙪 𝙘𝙖𝙣 𝙩𝙧𝙮 𝙩𝙮𝙥𝙞𝙣𝙜 𝙮𝙤𝙪𝙧 𝙦𝙪𝙚𝙧𝙮 𝙖𝙜𝙖𝙞𝙣 𝙤𝙧 𝙧𝙚𝙨𝙚𝙣𝙙𝙞𝙣𝙜 𝙞𝙩. Ｔｈ𝚎ｒ𝚎 𝚖𝚒𝚐ｈｔ ｂ𝚎 𝚊ｎ 𝚒𝚜𝚜𝚞𝚎 𝚠𝚒ｔｈ ｔｈ𝚎 𝚜𝚎ｒｖ𝚎ｒ ｔｈ𝚊ｔ\'s 𝙘𝙖𝙪𝙨𝙞𝙣𝙜 𝙩𝙝𝙚 𝙥𝙧𝙤𝙗𝙡𝙚𝙢, 𝙖𝙣𝙙 𝙞𝙩 𝙢𝙞𝙜𝙝𝙩 𝙧𝙚𝙨𝙤𝙡𝙫𝙚 𝙤𝙣 𝙧𝙚𝙩𝙧𝙮𝙞𝙣𝙜.', event.threadID);
	}
};
      
