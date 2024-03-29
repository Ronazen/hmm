const fs = require('fs');
const path = require('path');
const login = require('./fb-chat-api/index');
const express = require('express');
const app = express();
const chalk = require('chalk');
const bodyParser = require('body-parser');
const axios = require('axios');
const script = path.join(__dirname, 'script');
const moment = require("moment-timezone");
const cron = require('node-cron');
const config = fs.existsSync('./data') && fs.existsSync('./data/config.json') ? JSON.parse(fs.readFileSync('./data/config.json', 'utf8')) : creatqeConfig();
const Utils = new Object({
	commands: new Map(),
	handleEvent: new Map(),
	account: new Map(),
	cooldowns: new Map(),
});
fs.readdirSync(script).forEach((file) => {
	const scripts = path.join(script, file);
	const stats = fs.statSync(scripts);
	if (stats.isDirectory()) {
		fs.readdirSync(scripts).forEach((file) => {
			try {
				const {
					config,
					run,
					handleEvent
				} = require(path.join(scripts, file));
				if (config) {
					const {
						name = [], role = '0', version = '1.0.0', hasPrefix = true, aliases = [], description = '', usage = '', credits = '', cooldown = '5'
					} = Object.fromEntries(Object.entries(config).map(([key, value]) => [key.toLowerCase(), value]));
					aliases.push(name);
					if (run) {
						Utils.commands.set(aliases, {
							name,
							role,
							run,
							aliases,
							description,
							usage,
							version,
							hasPrefix: config.hasPrefix,
							credits,
							cooldown
						});
					}
					if (handleEvent) {
						Utils.handleEvent.set(aliases, {
							name,
							handleEvent,
							role,
							description,
							usage,
							version,
							hasPrefix: config.hasPrefix,
							credits,
							cooldown
						});
					}
				}
			} catch (error) {
				console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
			}
		});
	} else {
		try {
			const {
				config,
				run,
				handleEvent
			} = require(scripts);
			if (config) {
				const {
					name = [], role = '0', version = '1.0.0', hasPrefix = true, aliases = [], description = '', usage = '', credits = '', cooldown = '5'
				} = Object.fromEntries(Object.entries(config).map(([key, value]) => [key.toLowerCase(), value]));
				aliases.push(name);
				if (run) {
					Utils.commands.set(aliases, {
						name,
						role,
						run,
						aliases,
						description,
						usage,
						version,
						hasPrefix: config.hasPrefix,
						credits,
						cooldown
					});
				}
				if (handleEvent) {
					Utils.handleEvent.set(aliases, {
						name,
						handleEvent,
						role,
						description,
						usage,
						version,
						hasPrefix: config.hasPrefix,
						credits,
						cooldown
					});
				}
			}
		} catch (error) {
			console.error(chalk.red(`Error installing command from file ${file}: ${error.message}`));
		}
	}
});
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(express.json());
const routes = [{
	path: '/',
	file: 'index.html'
}, {
	path: '/step_by_step_guide',
	file: 'guide.html'
}, {
	path: '/online_user',
	file: 'online.html'
}, ];
routes.forEach(route => {
	app.get(route.path, (req, res) => {
		res.sendFile(path.join(__dirname, 'public', route.file));
	});
});
app.get('/info', (req, res) => {
	const data = Array.from(Utils.account.values()).map(account => ({
		name: account.name,
		profileUrl: account.profileUrl,
		thumbSrc: account.thumbSrc,
		time: account.time
	}));
	res.json(JSON.parse(JSON.stringify(data, null, 2)));
});
app.get('/commands', (req, res) => {
	const command = new Set();
	const commands = [...Utils.commands.values()].map(({
		name
	}) => (command.add(name), name));
	const handleEvent = [...Utils.handleEvent.values()].map(({
		name
	}) => command.has(name) ? null : (command.add(name), name)).filter(Boolean);
	const role = [...Utils.commands.values()].map(({
		role
	}) => (command.add(role), role));
	const aliases = [...Utils.commands.values()].map(({
		aliases
	}) => (command.add(aliases), aliases));
	res.json(JSON.parse(JSON.stringify({
		commands,
		handleEvent,
		role,
		aliases
	}, null, 2)));
});
app.post('/login', async (req, res) => {
	const {
		state,
		commands,
		prefix,
		admin
	} = req.body;
	try {
		if (!state) {
			throw new Error('Missing app state data');
		}
		const cUser = state.find(item => item.key === 'c_user');
		if (cUser) {
			const existingUser = Utils.account.get(cUser.value);
			if (existingUser) {
				console.log(`User ${cUser.value} is already logged in`);
				return res.status(400).json({
					error: false,
					message: "Active user session detected; already logged in",
					user: existingUser
				});
			} else {
				try {
					await accountLogin(state, commands, prefix, [admin]);
					res.status(200).json({
						success: true,
						message: 'Authentication process completed successfully; login achieved.'
					});
				} catch (error) {
					console.error(error);
					res.status(400).json({
						error: true,
						message: error.message
					});
				}
			}
		} else {
			return res.status(400).json({
				error: true,
				message: "There's an issue with the appstate data; it's invalid."
			});
		}
	} catch (error) {
		return res.status(400).json({
			error: true,
			message: "There's an issue with the appstate data; it's invalid."
		});
	}
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⠿⠛⢉⣉⣠⣤⣤⣤⣴⣦⣤⣤⣀⡉⠙⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⠋⢁⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⡀⠙⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⡟⠁⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠿⠿⠂⠀⠹⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⡟⠀⣼⣿⣿⡏⢉⣁⣀⣀⣤⣤⣄⠀⣴⣿⣿⡇⢠⣶⣶⠒⠲⡆⢀⠈⢿⣿⣿⣿⣿⣿⣿⣿
⣿⠁⣼⣿⣿⣿⠀⢿⣿⣿⣏⣀⣹⠟⢀⣿⣿⣿⣷⡈⠛⠿⠃⢀⣠⣿⣆⠈⣿⣿⣿⣿⣿⣿⣿
⡇⢠⣿⣿⣿⣿⣧⣀⠉⠛⠛⠉⣁⣠⣾⣿⣿⣿⣿⣿⣷⣶⠾⠿⠿⣿⣿⡄⢸⣿⣿⣿⣿⣿⣿
⡇⢸⣿⣿⣿⣿⡿⠿⠟⠛⠛⠛⢉⣉⣉⣉⣉⣩⣤⣤⣤⣤⠀⣴⣶⣿⣿⡇⠀⣿⣿⣿⣿⣿⣿
⠅⢸⣿⣿⣿⣷⣶⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠇⢸⣿⣿⣿⠃⢸⣿⣿⣿⠛⢻⣿
⣇⠈⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠉⣿⡟⢀⣾⣿⠟⠁⣰⣿⣿⣿⡿⠀⠸⣿
⣿⣆⠀⠻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠏⠀⠙⣠⣾⠟⠁⣠⣾⣿⣿⣿⣿⠀⣶⠂⣽
⣿⣿⣷⣄⡈⠙⠻⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠃⣴⠆⠀⠋⢀⣴⣿⣿⡿⠟⠛⠉⠀⢂⣡⣾⣿
⣿⣿⣿⣿⣿⠇⢀⣄⣀⡉⠉⠉⠉⠉⠉⣉⠤⠈⢁⣤⣶⠀⠾⠟⣋⡡⠔⢊⣠⣴⣾⣿⣿⣿⣿
⣿⣿⣿⣿⠏⢠⣿⣿⡿⠛⢋⣠⠴⠚⢉⣥⣴⣾⣿⣿⣿⠀⠴⠛⣉⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⡏⢀⣿⣿⣯⠴⠛⠉⣠⣴⣾⣿⣿⣿⣿⣿⣿⣿⠀⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⡟⠀⣼⣿⣿⣧⣤⣶⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⠃⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⡟⠀⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡇⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⠃⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣧⠀⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣷⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱▱

███████╗██╗░░░██╗░█████╗░██╗░░██╗
██╔════╝██║░░░██║██╔══██╗██║░██╔╝
█████╗░░██║░░░██║██║░░╚═╝█████═╝░
██╔══╝░░██║░░░██║██║░░██╗██╔═██╗░
██║░░░░░╚██████╔╝╚█████╔╝██║░╚██╗
╚═╝░░░░░░╚═════╝░░╚════╝░╚═╝░░╚═╝

██╗░░░██╗░█████╗░██╗░░░██╗
╚██╗░██╔╝██╔══██╗██║░░░██║
░╚████╔╝░██║░░██║██║░░░██║
░░╚██╔╝░░██║░░██║██║░░░██║
░░░██║░░░╚█████╔╝╚██████╔╝
░░░╚═╝░░░░╚════╝░░╚═════╝░ 

"✖ [░░░░░░░░░░░░░░░]",
"✖ [■░░░░░░░░░░░░░░]",
"✖ [■■░░░░░░░░░░░░░]",
"✖ [■■■░░░░░░░░░░░░]",
"✖ [■■■■░░░░░░░░░░░]",
"✖ [■■■■■░░░░░░░░░░]",
"✖ [■■■■■■░░░░░░░░░]",
"✖ [■■■■■■■░░░░░░░░]",
"✖ [■■■■■■■■░░░░░░░]",
"✖ [■■■■■■■■■░░░░░░]",
"✖ [■■■■■■■■■■░░░░░]",
"✖ [■■■■■■■■■■■░░░░]",
"✖ [■■■■■■■■■■■■░░░]",
"✖ [■■■■■■■■■■■■■░░]",
"✖ [■■■■■■■■■■■■■■░]",
"✖ [■■■■■■■■■■■■■■■]"
${port}`);
});
process.on('unhandledRejection', (reason) => {
	console.error('Unhandled Promise Rejection:', reason);
});
async function accountLogin(state, enableCommands = [], prefix, admin = []) {
	return new Promise((resolve, reject) => {
		login({
			appState: state
		}, async (error, api) => {
			if (error) {
				reject(error);
				return;
			}
			const userid = await api.getCurrentUserID();
			addThisUser(userid, enableCommands, state, prefix, admin);
			try {
				const userInfo = await api.getUserInfo(userid);
				if (!userInfo || !userInfo[userid]?.name || !userInfo[userid]?.profileUrl || !userInfo[userid]?.thumbSrc) throw new Error('Unable to locate the account; it appears to be in a suspended or locked state.');
				const {
					name,
					profileUrl,
					thumbSrc
				} = userInfo[userid];
				let time = (JSON.parse(fs.readFileSync('./data/history.json', 'utf-8')).find(user => user.userid === userid) || {}).time || 0;
				Utils.account.set(userid, {
					name,
					profileUrl,
					thumbSrc,
					time: time
				});
				const intervalId = setInterval(() => {
					try {
						const account = Utils.account.get(userid);
						if (!account) throw new Error('Account not found');
						Utils.account.set(userid, {
							...account,
							time: account.time + 1
						});
					} catch (error) {
						clearInterval(intervalId);
						return;
					}
				}, 1000);
			} catch (error) {
				reject(error);
				return;
			}
			api.setOptions({
				listenEvents: config[0].fcaOption.listenEvents,
				logLevel: config[0].fcaOption.logLevel,
				updatePresence: config[0].fcaOption.updatePresence,
				selfListen: config[0].fcaOption.selfListen,
				forceLogin: config[0].fcaOption.forceLogin,
				online: config[0].fcaOption.online,
				autoMarkDelivery: config[0].fcaOption.autoMarkDelivery,
				autoMarkRead: config[0].fcaOption.autoMarkRead,
			});
			try {
				var listenEmitter = api.listenMqtt(async (error, event) => {
					if (error) {
						if (error === 'Connection closed.') {
							console.error(`Error during API listen: ${error}`, userid);
						}
						console.log(error)
					}
					let database = fs.existsSync('./data/database.json') ? JSON.parse(fs.readFileSync('./data/database.json', 'utf8')) : createDatabase();
					let data = Array.isArray(database) ? database.find(item => Object.keys(item)[0] === event?.threadID) : {};
					let adminIDS = data ? database : createThread(event.threadID, api);
					let blacklist = (JSON.parse(fs.readFileSync('./data/history.json', 'utf-8')).find(blacklist => blacklist.userid === userid) || {}).blacklist || [];
					let hasPrefix = (event.body && aliases((event.body || '')?.trim().toLowerCase().split(/ +/).shift())?.hasPrefix == false) ? '' : prefix;
					let [command, ...args] = ((event.body || '').trim().toLowerCase().startsWith(hasPrefix?.toLowerCase()) ? (event.body || '').trim().substring(hasPrefix?.length).trim().split(/\s+/).map(arg => arg.trim()) : []);
					if (hasPrefix && aliases(command)?.hasPrefix === false) {
						api.sendMessage(`Invalid usage this command doesn't need a prefix`, event.threadID, event.messageID);
						return;
					}
					if (event.body && aliases(command)?.name) {
						const role = aliases(command)?.role ?? 0;
						const isAdmin = config?.[0]?.masterKey?.admin?.includes(event.senderID) || admin.includes(event.senderID);
						const isThreadAdmin = isAdmin || ((Array.isArray(adminIDS) ? adminIDS.find(admin => Object.keys(admin)[0] === event.threadID) : {})?.[event.threadID] || []).some(admin => admin.id === event.senderID);
						if ((role == 1 && !isAdmin) || (role == 2 && !isThreadAdmin) || (role == 3 && !config?.[0]?.masterKey?.admin?.includes(event.senderID))) {
							api.sendMessage(`You don't have permission to use this command.`, event.threadID, event.messageID);
							return;
						}
					}
					if (event.body && event.body?.toLowerCase().startsWith(prefix.toLowerCase()) && aliases(command)?.name) {
						if (blacklist.includes(event.senderID)) {
							api.sendMessage("We're sorry, but you've been banned from using bot. If you believe this is a mistake or would like to appeal, please contact one of the bot admins for further assistance.", event.threadID, event.messageID);
							return;
						}
					}
					if (event.body !== null) {
						// Check if the message type is log:subscribe
						if (event.logMessageType === "log:subscribe") {
							const request = require("request");
							const moment = require("moment-timezone");
							var thu = moment.tz('Asia/Manila').format('dddd');
							if (thu == 'Sunday') thu = 'Sunday'
							if (thu == 'Monday') thu = 'Monday'
							if (thu == 'Tuesday') thu = 'Tuesday'
							if (thu == 'Wednesday') thu = 'Wednesday'
							if (thu == "Thursday") thu = 'Thursday'
							if (thu == 'Friday') thu = 'Friday'
							if (thu == 'Saturday') thu = 'Saturday'
							const time = moment.tz("Asia/Manila").format("HH:mm:ss - DD/MM/YYYY");										
							const fs = require("fs-extra");
							const { threadID } = event;

					if (event.logMessageData.addedParticipants && Array.isArray(event.logMessageData.addedParticipants) && event.logMessageData.addedParticipants.some(i => i.userFbId == userid)) {
					api.changeNickname(`》 ${prefix} 《 ❃ ➠ 𝗔𝗨𝗧𝗢𝗕𝗢𝗕𝗢𝗧`, threadID, userid);

let gifUrls = [
	'https://i.imgur.com/209z0iM.mp4',
	'https://i.imgur.com/VTZWEmH.mp4',
	'https://i.imgur.com/FO3UI1c.mp4',
	'https://i.imgur.com/X34qKhJ.mp4',
	'https://i.imgur.com/WK22w8v.mp4',
	'https://i.imgur.com/tvVDuo6.mp4',
	'https://i.imgur.com/3tgiqQd.mp4',
	'https://i.imgur.com/AfkKH9h.mp4',
	'https://i.imgur.com/wIGJBXq.mp4',
	'https://i.imgur.com/lmMWsR8.mp4',
  'https://i.imgur.com/x0c92nj.mp4'
];

let randomIndex = Math.floor(Math.random() * gifUrls.length);
let gifUrl = gifUrls[randomIndex];
let gifPath = __dirname + '/cache/connected.mp4';

axios.get(gifUrl, { responseType: 'arraybuffer' })
		.then(response => {
				fs.writeFileSync(gifPath, response.data); 
				return api.sendMessage("𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗜𝗡𝗚...", event.threadID, () => 
						api.sendMessage({ 
								body:`💛💚💙\n\n✅ 𝗦𝗨𝗖𝗖𝗘𝗦𝗦𝗙𝗨𝗟 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗!! \n➭ Bot Prefix: ${prefix}\n➭ Admin: ‹𝗝𝗮𝘆𝗺𝗮𝗿›\n➭ Facebook: ‹https://www.facebook.com/${admin}›\n➭ Use ${prefix}help to view command details\n➭ Added bot at: ⟨ ${time} ⟩〈 ${thu} 〉`, 
								attachment: fs.createReadStream(gifPath)
						}, event.threadID)
				);
		})
		.catch(error => {
				console.error(error);
		});
							} else {
								try {
									const fs = require("fs-extra");
									let { threadName, participantIDs } = await api.getThreadInfo(threadID);

									var mentions = [], nameArray = [], memLength = [], userID = [], i = 0;

									let addedParticipants1 = event.logMessageData.addedParticipants;
									for (let newParticipant of addedParticipants1) {
										let userID = newParticipant.userFbId;
										api.getUserInfo(parseInt(userID), (err, data) => {
											if (err) { return console.log(err); }
											var obj = Object.keys(data);
											var userName = data[obj].name.replace("@", "");
											if (userID !== api.getCurrentUserID()) {

												nameArray.push(userName);
												mentions.push({ tag: userName, id: userID, fromIndex: 0 });

												memLength.push(participantIDs.length - i++);
												memLength.sort((a, b) => a - b);

													(typeof threadID.customJoin == "undefined") ? msg = "👋 Hi!, {uName}\n┌────── ～●～ ──────┐\n----- Welcome to {threadName} -----\n└────── ～●～ ──────┘\nYou're the {soThanhVien} member of this group, please enjoy! ❣️❣️" : msg = threadID.customJoin;
													msg = msg
														.replace(/\{uName}/g, nameArray.join(', '))
														.replace(/\{type}/g, (memLength.length > 1) ? 'you' : 'Friend')
														.replace(/\{soThanhVien}/g, memLength.join(', '))
														.replace(/\{threadName}/g, threadName);

const bayot = [
  'https://i.ibb.co/0jfD13g/5bf47044-0957-4f8a-a166-9bca3f4aa7cd.jpg',
  'https://i.ibb.co/jhgc8Kj/ad523982-a45e-41db-836c-f76b5aaa4f9c.jpg',
  'https://i.ibb.co/vwMwRkn/aa13cba8-1c81-4062-87d0-272fcaf88212.jpg',
	'https://i.ibb.co/HC9wQVT/351c6943-dd38-4833-a1af-f06dafa4277f.jpg',
	'https://i.ibb.co/mNGVcRM/Background-Designs-de-Rise-of-the-Teenage-Mutant-Ninja-Turtles-THECAB.jpg'
];
const sheshh = bayot[Math.floor(Math.random() * bayot.length)];

const lubot = [
  'https://i.postimg.cc/LszC2cBQ/received-3344157609215944.jpg',
	'https://i.postimg.cc/yYHFzDrK/received-1142561846900818.jpg',
	'https://i.postimg.cc/fbnsHhR8/received-954065659759363.jpg',
	'https://i.postimg.cc/nzXqvNMH/received-709365284696128.jpg',
	'https://i.postimg.cc/CLSz0WYz/orca-image-1580944726.jpg',
	'https://i.postimg.cc/Y9Db71LS/orca-image-361667317.jpg',
	'https://i.postimg.cc/W3xYrGNH/orca-image-1197286104.jpg'
];
const yawa = lubot[Math.floor(Math.random() * lubot.length)];
												
													let callback = function() {
														return api.sendMessage({ body: msg, attachment: fs.createReadStream(__dirname + `/cache/come.jpg`), mentions }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/come.jpg`))
													};
												request(encodeURI(`https://api.popcat.xyz/welcomecard?background=${sheshh}&text1=${userName}&text2=Welcome+To+${threadName}&text3=You+Are+The${participantIDs.length}th+Member&avatar=${yawa}`)).pipe(fs.createWriteStream(__dirname + `/cache/come.jpg`)).on("close", callback);
																			}
																		})
																	}
																} catch (err) {
																	return console.log("ERROR: " + err);
						}
					 }
					}
					}
					if (event.body !== null) {
							if (event.logMessageType === "log:unsubscribe") {
									api.getThreadInfo(event.threadID).then(({ participantIDs }) => {
											let leaverID = event.logMessageData.leftParticipantFbId;
											api.getUserInfo(leaverID, (err, userInfo) => {
													if (err) {
															return console.error('Failed to get user info:', err);
													}
													const name = userInfo[leaverID].name;
													const type = (event.author == event.logMessageData.leftParticipantFbId) ? "left the group." : "was kicked by Admin of the group";

													const link = ["https://i.imgur.com/dVw3IRx.gif"];
													const gifPath = __dirname + "/cache/leave.gif";

													// Assuming the file exists, send the message with the GIF
													api.sendMessage({ body: `${name} ${type}, There are now ${participantIDs.length} members in the group, please enjoy!`, attachment: fs.createReadStream(gifPath) }, event.threadID);
											});
									});
							}
					}
					const regex = [
  /https:\/\/(www\.)?facebook\.com\/reel\/\d+\?mibextid=[a-zA-Z0-9]+(?!;)/,
  /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9]+\/videos\/[0-9]+\/\?mibextid=[a-zA-Z0-9]+$/,
	/^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9]+\/videos\/[^\?\/]+\/\?mibextid=[a-zA-Z0-9]+$/,
	/^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9]+\/videos\/[a-zA-Z0-9]+\/\?mibextid=[a-zA-Z0-9]+$/,
 /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9]+\/videos\/[0-9]+\/\?mibextid=[a-zA-Z0-9]+$/
];

					if (event.body !== null && !regex.some(pattern => pattern.test(event.body))) {
							const fs = require("fs-extra");
							const axios = require("axios");
							const qs = require("qs");
							const cheerio = require("cheerio");  
							try {
									const url = event.body;
									const path = `./cache/${Date.now()}.mp4`;

									axios({
											method: "GET",
											url: `https://insta-downloader-ten.vercel.app/insta?url=${encodeURIComponent(url)}`
									})
									.then(async (res) => {
											if (res.data.url) {
													const response = await axios({
															method: "GET",
															url: res.data.url,
															responseType: "arraybuffer"
													});
													fs.writeFileSync(path, Buffer.from(response.data, "utf-8"));
													if (fs.statSync(path).size / 1024 / 1024 > 25) {
															return api.sendMessage("The file is too large, cannot be sent", event.threadID, () => fs.unlinkSync(path), event.messageID);
													}

													const messageBody = `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 Instagram\n\n𝗔𝗨𝗧𝗢 𝗕𝗢𝗕𝗢𝗧 🤖`;
													api.sendMessage({
															body: messageBody,
															attachment: fs.createReadStream(path)
													}, event.threadID, () => fs.unlinkSync(path), event.messageID);
							} else {
						}
          });
						} catch (err) {
							 console.error(err);
						}
					}
					if (event.body !== null) {
							api.markAsReadAll(() => { });
					}
					if (event.body !== null) {
						 const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
						 const link = event.body;
																if (regEx_tiktok.test(link)) {
																	api.setMessageReaction("❣️", event.messageID, () => { }, true);
																	axios.post(`https://www.tikwm.com/api/`, {
																		url: link
																	}).then(async response => { // Added async keyword
																		const data = response.data.data;
																		const videoSt
