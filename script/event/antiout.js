module.exports.config = {
  name: "antiout",
  version: "1.0.0"
};
module.exports.handleEvent = async ({
  event,
  api
}) => {
  if (event.logMessageData?.leftParticipantFbId === api.getCurrentUserID()) return;
  if (event.logMessageData?.leftParticipantFbId) {
    const info = await api.getUserInfo(event.logMessageData?.leftParticipantFbId);
    const {
      name
    } = info[event.logMessageData?.leftParticipantFbId];
    api.addUserToGroup(event.logMessageData?.leftParticipantFbId, event.threadID, (error) => {
      if (error) {
        api.sendMessage(`Unable to re-add member ${name} to the group!`, event.threadID);
      } else {
        api.sendMessage(`Active antiout mode, ${name} 𝙖𝙖𝙡𝙞𝙨 𝙠𝙖? 𝙖𝙡𝙖𝙢 𝙢𝙤 𝙣𝙖𝙢𝙖𝙣𝙜 𝙢𝙖𝙢𝙞𝙢𝙞𝙨𝙨 𝙠𝙞𝙩𝙖 𝗸𝗮𝘆𝗮 𝗱𝗶𝘁𝗼 𝗸𝗮𝗹𝗮𝗻𝗴 𝘄𝗮𝗹𝗮𝗻𝗴 𝗮𝗮𝗹𝗶𝘀!`, event.threadID);
      }
    });
  }
};
