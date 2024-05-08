const axios = require('axios');

module.exports.config = {
		name: "ai",
		version: 1.0,
		credits: "OtinXSandip",
		description: "AI",
		hasPrefix: false,
		usages: "{pn} [prompt]",
		aliases: ["ask"],
		cooldown: 0,
};

module.exports.run = async function ({ api, event, args }) {
		try {
				const prompt = args.join(" ");
				if (!prompt) {
						await api.sendMessage("┍━━━━━━━━»•» ⌖ «•«━┑



┕━»•» ⌖ «•«━━━━━━━━┙", event.threadID);
						return;
        }
    api.setMessageReaction("🔎", event.messageID, (err) => {}, true);
         const response = await axios.get(`https://sandipbaruwal.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
				const answer = response.data.answer;

				await api.sendMessage('┍━━━━━━━━»•» ⌖ «•«━┑



┕━»•» ⌖ «•«━━━━━━━━┙' + '\n\n‎‧₊˚✧[ 𝐌𝐚𝐝𝐞 𝐛𝐲 𝐉𝐚𝐲𝐦𝐚𝐫 ]✧˚₊‧:\nhttps://web.facebook.com/profile.php', event.threadID);
		} catch (error) {
				console.error("⚠️ | Error Please Contact the Developer for an Error\n\n-fblink: https://web.facebook.com/profile.php https://www.facebook.com/RnaznZhia", error.message);
		}
};
