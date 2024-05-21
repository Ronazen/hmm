const axios = require('axios');

module.exports.config = {
	name: "blackbox",
	version: "9",
	role: 0,
	hasPrefix: false,
	credits: "Eugene Aguilar",
	description: "AI powered by blackbox",
	aliases: ["black"],
	cooldowns: 0,
};

module.exports.run = async function ({api, event, args}) {
	if (!args[0]) {
		api.sendMessage("Please provide a question.", event.threadID, event.messageID);
		return;
	}
	const rona = "100082748880815";
   if (!rona.includes(event.senderID))
   return api.sendMessage("❌ only admin can  use this command.", event.threadID, event.messageID);

	const query = encodeURIComponent(args.join(" "));
	const apiUrl = `https://api.easy-api.online/api/blackbox?query=${query}`;

	try {
		const response = await axios.get(apiUrl);
		const ans = response.data.response;
		api.sendMessage(ans, event.threadID, event.messageID);
	} catch (error) {
		console.error("Error:", error);
		api.sendMessage("An error occurred while fetching the response.", event.threadID, event.messageID);
	}
};
