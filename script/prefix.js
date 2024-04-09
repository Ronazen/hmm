module.exports.config = {
  name: "prefix",
  version: "1.0.2",
  hasPermssion: 0,
  credits: "Aesther | Heru",
  description: "prefix",
  usePrefix: "false",
  commandCategory: "system",
  usages: "[Name module]",
  cooldowns: 1,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

module.exports.run = async function({ api, event }) {

  api.sendMessage(`〉【 ⚉ 】• 𝗠𝗬 𝗣𝗥𝗘𝗙𝗜𝗫 :⟬ ${global.config.PREFIX} ⟭`,
  
  event.threadID, event.messageID);
  

}
  
