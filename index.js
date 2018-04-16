const botconfig = require("./botconfig.js");
const Discord = require("discord.js");
const fs = require("fs");
const pg = require("pg");
const bot = new Discord.Client({
	disableEveryone: true
});
bot.counter = false;
bot.commands = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {
	if(err) console.log(err);
	let jsfile = files.filter(f => f.split(".").pop() === "js")
	if(jsfile.length <= 0) {
		console.log("Couldn't find commands.");
		return;
	}
	jsfile.forEach((f, i) => {
		let props = require(`./commands/${f}`);
		console.log(`${f} loaded!`);
		bot.commands.set(props.help.name, props);
	});
});

bot.on("ready", async () => {
	console.log(`${bot.user.username} is online!`);
	let tchannel = bot.channels.find(`id`, "424010321750130689")

	await tchannel.bulkDelete(100)
	await bot.user.setActivity("Woke Up From A Nap!!", {
		type: "PLAYING"
	});
});

bot.on("guildCreate", async guild => {
	let hello = new Discord.RichEmbed()
		.setTitle("Thanks For Adding Me To Your Server!")
		.setColor("#0000ff")
		.setDescription("Thanks for adding Mr.W Bot to your server he is a very helpful bot! This bot is owned by Windows 10 > MacOS#0001 and was made by @ethanlaj For all the cmds run !!help however if u need any help join our support server https://discord.gg/UC37qGN");

	let hichannels = guild.channels.filter(c => c.type === "text")
	let ahichannels = hichannels.filter(c => c.permissionsFor(bot.user).has("READ_MESSAGES"));
	let fhichannel = ahichannels.filter(c => c.permissionsFor(bot.user).has("SEND_MESSAGES"));
	let hichannel = fhichannel.first()
	if(hichannel) {
		await hichannel.send(hello)
	}

	if(bot.counter) await bot.user.setActivity(`${bot.guilds.size} servers`, {
		type: "WATCHING"
	});
});

bot.on("guildDelete", guild => {
	if(bot.counter) bot.user.setActivity(`${bot.guilds.size} servers`, {
		type: "WATCHING"
	});
});

bot.on("message", async message => {
	if(message.channel.type === "dm") return;
	if((message.content.endsWith("messages that were not over two weeks old!")) && (message.author.bot)) {
		message.delete(5000);
	}
	if((message.content.endsWith("just talk again!")) && (message.author.bot)) {
		message.delete(5000);
	}
	if((message.content.endsWith("**MUST WAIT TO USE REPORT COMMAND**")) && (message.author.bot) && (message.channel.id === "420748985410650123")) {
		message.delete(300000);
	}
	if((message.content.endsWith("Your AFK status was removed.")) && (message.author.bot)) {
		message.delete(5000);
	}
	if((message.content.includes("This user is currently AFK!")) && (message.author.bot)) {
		message.delete(5000);
	}
	if(message.author.bot === false) {
		let channel = bot.channels.find(`id`, "422201325623836682");
		let messages = await channel.fetchMessages({
			limit: 100
		});
		let array = messages.filter(m => RegExp(message.author.id, "gi").test(m.content));
		let first = array.first();
		if(first) {
			first.delete();
			message.reply("Welcome back! Your AFK status was removed.");
		}
	}
	let messageArray = message.content.split(" ");
	let cmd = messageArray[0].toLowerCase();
	if(!cmd) return;
	let args = messageArray.slice(1);
	let content = args.join(" ");
	if(message.author.bot === false) {
		let mentions = message.mentions.members.first();
		if(mentions) {
			let channel = bot.channels.find("id", "422201325623836682");
			let messages = await channel.fetchMessages({
				limit: 100
			});
			let array = messages.filter(m => RegExp(mentions.id, "gi").test(m.content));
			let first = array.first();
			if(first) {
				let afkmsg = first.content.substr(mentions.id.length);
				message.reply(`This user is currently AFK!\nAFK Message: \`${afkmsg}\``)
			}
		}
	}
	let guildid = message.guild.id
	let dbguild = bot.guilds.find(`id`, "417149156193337344");
	let channels = dbguild.channels.filter(m => RegExp("wbotprefixes-database", "gi").test(m.name));
	async function getPrefix(bot, message, args) {
		const nestedMessages = await Promise.all(channels.map(ch => ch.fetchMessages({
			limit: 100
		})))
		const flatMessages = nestedMessages.reduce((a, b) => a.concat(b))
		const msg = flatMessages.find(msg => msg.content.startsWith(message.guild.id))
		return msg && msg.content.substr(1 + message.guild.id.length)
	}
	const aprefix = await getPrefix(bot, message, args)
	if(aprefix) var prefix = aprefix
	//console.log(`${prefix} second`)
	if(!aprefix) var prefix = botconfig.prefix
	// console.log(`${prefix} third`)
	if((message.isMemberMentioned(bot.user)) && (message.content.endsWith("prefix"))) {
		return message.reply(`My prefix is \`${prefix}\``)
	}
	if((message.isMemberMentioned(bot.user)) && (message.content.endsWith("prefix reset")) && (message.member.hasPermission("MANAGE_GUILD"))) {

		let aaa = dbguild.channels.filter(m => RegExp("wbotprefixes-database", "gi").test(m.name));
		aaa.forEach(chl => {
			chl.fetchMessages({
				limit: 100
			}).then(msgs => {
				msgs.forEach(msg => {
					if(msg.content.startsWith(`${message.guild.id}`)) {
						msg.delete()
					}
				})
			})
		})
		message.react("\u2705")

	}

	if(!message.content.startsWith(prefix)) return;
	let commandfile = bot.commands.get(cmd.slice(prefix.length));
	if(!commandfile) return;
	return commandfile.run(bot, message, args, prefix, content);
});


bot.login(botconfig.token);
