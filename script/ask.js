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
						await api.sendMessage("✧⁠   ∩_∩\n✧⁠◝( ⁠ꈍ⁠ᴗ⁠ꈍ)◜⁠✧\n┏━━∪∪━━━━━━━━━━━━┓\n\n𝙷𝚎𝚢 𝙸'𝚖 𝚢𝚘𝚞𝚛 𝚟𝚒𝚛𝚝𝚞𝚊𝚕 𝚊𝚜𝚜𝚒𝚜𝚝𝚊𝚗𝚝, 𝚊𝚜𝚔 𝚖𝚎 𝚊 𝚚𝚞𝚎𝚜𝚝𝚒𝚘𝚗.\n\n┗━━━━━━━━━━━━━━━━┛", event.threadID);
						return;
        }
    api.setMessageReaction("🔎", event.messageID, (err) => {}, true);
         const response = await axios.get(`https://sandipbaruwal.onrender.com/gpt?prompt=${encodeURIComponent(prompt)}`);
      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
				const answer = response.data.answer;

				await api.sendMessage('✧⁠   ∩_∩\n✧⁠◝( ⁠ꈍ⁠ᴗ⁠ꈍ)◜⁠✧\n┏━━∪∪━━━━━━━━━━━━┓' + answer + '\n\n┗━━━━━━━━━━━━━━━━┛' + '\n\n𝗖𝗿𝗲𝗮𝘁𝗲 𝘆𝗼𝘂𝗿 𝗼𝘄𝗻 𝗮𝘂𝘁𝗼𝗯𝗼𝘁:\nhttps://autobobot.onrender.com', event.threadID);
		} catch (error) {
				console.error("⚠️ | Error Please Contact the Developer for an Error\n\n-fblink: https://www.facebook.com/jaymar.dev.00", error.message);
		}
};
