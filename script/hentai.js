const axios = require("axios");
const fs = require("fs");
const path = require("path");
const vipData = fs.readFileSync(path.join(__dirname, "vip.json"), "utf8");
const vipJson = JSON.parse(vipData);
function isVip(senderID) {
  return vipJson.permission.includes(senderID.toString());
}

module.exports = {
	config: {
		name: "hentai",
		aliases: ["hen"],
		version: "1.0",
		author: "Kaizenji",
              countDown: 5,
		role: 0,
		shortDescription: "nhentai anime",
		longDescription: "sends random nhentai",
		category: "18+ VIP",
		guide: "{pn}"
	},

	onStart: async function ({ api, event, args, message }) {
   
if (!isVip(event.senderID)) {
      api.sendMessage("You are not a VIP member, contact admin(s) to access VIP command's.", event.threadID, event.messageID);
      return;
    }

	  var link = [
"https://i.imgur.com/mNesqCm.jpg",
"https://i.imgur.com/ChtMmje.jpg",
"https://i.imgur.com/2oTwWjZ.png",
"https://i.imgur.com/ZOcTTvR.jpg",
"https://i.imgur.com/ccLl6Ym.png",
"https://i.imgur.com/bdQ5fK9.png",
"https://i.imgur.com/zyqGxHc.png",
"https://i.imgur.com/1dFL3ZI.png",
"https://i.imgur.com/SKsfMCE.jpg",
"https://i.imgur.com/vhinUxm.png",
"https://i.imgur.com/5QXTkQr.jpg",
"https://i.imgur.com/cMeEbZe.jpg",
"https://i.imgur.com/HRDcYSW.jpg",
"https://i.imgur.com/sp1SnE4.jpg",
"https://i.imgur.com/Ki3hy27.jpg",
"https://i.imgur.com/8bxgU0f.jpg",
"https://i.imgur.com/7iDnRg6.jpg",
"https://i.imgur.com/shKYOem.png",
"https://i.imgur.com/MGNxYj4.jpg",
"https://i.imgur.com/1DTrdAl.jpg",
"https://i.imgur.com/xAKKpfT.png",
"https://i.imgur.com/ChtMmje.jpg",
"https://i.imgur.com/ujo6Yvu.jpg",
"https://i.imgur.com/dVcSVDs.jpg",
"https://i.imgur.com/rpdXJEa.jpg",
"https://i.imgur.com/sToM2cj.png",
"https://i.imgur.com/wzUFRb9.png",
"https://i.imgur.com/n378ZMT.png",
"https://i.imgur.com/A8dKVOY.jpg",
"https://i.imgur.com/6a7lQUa.jpg",
"https://i.imgur.com/Oc1XLXW.jpg",
"https://i.imgur.com/MpQ7qN3.png",
"https://i.imgur.com/GK2iXnb.jpg",
"https://i.imgur.com/cwHOc0j.jpg",
"https://i.imgur.com/NHRGsp6.jpg",
"https://i.imgur.com/Ia9ugv3.jpg",
"https://i.imgur.com/CqszBU7.jpg",
"https://i.imgur.com/JHm5muL.jpg",
"https://i.imgur.com/509DTo9.png",
"https://i.imgur.com/JjvzvuI.jpg",
"https://i.imgur.com/hMljgoy.jpg",
"https://i.imgur.com/lOn0Vru.jpg",
"https://i.imgur.com/eDFtiW3.jpg",
"https://i.imgur.com/JYKT9Uv.jpg",
"https://i.imgur.com/pG0YTtt.jpg",
"https://i.imgur.com/tZP3MMz.png",
"https://i.imgur.com/RM9ukif.jpg",
"https://i.imgur.com/gMRKKyj.png",
"https://i.imgur.com/m4WWhGW.png",
"https://i.imgur.com/3XcAUud.jpg",
"https://i.imgur.com/ycnn0HV.png",
"https://i.imgur.com/8VjmAbA.jpg",
"https://i.imgur.com/vXgbs3j.jpg",
"https://i.imgur.com/OQ3d05j.jpg",
"https://i.imgur.com/bXGDK0Y.jpg",
"https://i.imgur.com/UcvGgH7.jpg",
"https://i.imgur.com/Ei4JcHB.jpg",
"https://i.imgur.com/jHcd7na.jpg",
"https://i.imgur.com/FaN7cnv.png",
"https://i.imgur.com/hH0of56.png",
"https://i.imgur.com/pmUdyLW.jpg",
"https://i.imgur.com/gpsqjlX.jpg",
"https://i.imgur.com/ohpsz0U.jpg",
"https://i.imgur.com/Ar8ioUD.png",
"https://i.imgur.com/WsVWcq2.jpg",
"https://i.imgur.com/XzQTER5.jpg",
"https://i.imgur.com/0t1yKln.jpg",
"https://i.imgur.com/iXAHEqa.jpg",
"https://i.imgur.com/7yAtWmQ.png",
"https://i.imgur.com/71f21Ix.png",
"https://i.imgur.com/x0bcEFl.png",
"https://i.imgur.com/lH7lYVc.png",
"https://i.imgur.com/ba8LkRB.png",
"https://i.imgur.com/FsP5lSm.jpg",
"https://i.imgur.com/X25um8b.jpg",
"https://i.imgur.com/rSBexdO.png",
"https://i.imgur.com/tTTXPgb.png",
"https://i.imgur.com/MaBiBiD.png",
"https://i.imgur.com/cZwQjP7.jpg",
"https://i.imgur.com/iCFsBHc.jpg",
"https://i.imgur.com/dTZGPiM.jpg",
"https://i.imgur.com/bQ5xRTG.png",
"https://i.imgur.com/aFXDHWL.jpg",
"https://i.imgur.com/tdU2fbU.png",
"https://i.imgur.com/faRtrw6.png",
"https://i.imgur.com/id08VTo.png",
"https://i.imgur.com/heLM5yF.png",
"https://i.imgur.com/qwRAAlu.png",
"https://i.imgur.com/7lR2uR3.png",
"https://i.imgur.com/vL15U0T.jpg",
"https://i.imgur.com/jhuTb7V.png",        
]

let img = link[Math.floor(Math.random()*link.length)]
message.reply({body: "Here's your random hentai ❤",
  attachment: await global.utils.getStreamFromURL(img)
})
}
    }
