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
        api.sendMessage(`𝗚𝗢𝗢𝗗 𝗕𝗬𝗘  ${name} 𝗗𝗢𝗡'𝗧 𝗖𝗢𝗠𝗘𝗕𝗔𝗖𝗞-,-`, event.threadID);
      } else {
        api.sendMessage(`Active antiout mode, ${name} has been re-added to the group successfully!`, event.threadID);
      }
    });
  }
};
