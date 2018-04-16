const Discord = require("discord.js");



module.exports.run = async (bot, message, args, prefix, content) => {

	let target = message.guild.member(message.mentions.users.first());

	if (target) {

		if (message.member.hasPermission("KICK_MEMBERS") || message.member.hasPermission("ADMINISTRATOR") || message.member.hasPermission("BAN_MEMBERS")) {

			var dbguild = bot.guilds.get("417149156193337344");

			var dbchannels = dbguild.channels.filter(m => RegExp("warn-database", "gi").test(m.name));

			var warns = [];

			var warningnum = 0;

			var channelloop = 0;

			var messageloop = 0;

			dbchannels.forEach(dbchannel => {

				dbchannel.fetchMessages({

					limit: 100

				}).then(messages => {

					messages.forEach(msg => {

						if (msg.content.startsWith(`${message.guild.id} ${target.id}`)) {

							warningnum = warningnum + 1;

							warns.push(`${dbchannel.id} ${msg.id}`);

						}

						messageloop = messageloop + 1;

						if (messageloop == messages.size) {

							var warnslength = warns.length;

							messageloop = 0;

							channelloop = channelloop + 1;

							if (channelloop == dbchannels.size) {

								if (warningnum == 0) return message.reply("There are no warnings on this user!");

								var count = 1;

								message.reply(`Removed warn ${count}/${warningnum} for \`${target.user.tag}\`.`).then(m => {

									warns.forEach(warn => {

										dbguild.channels.get(warn.substr(0, 18)).fetchMessage(warn.substr(19)).then(wm => {

											wm.delete();

											if (count == warningnum) return m.edit(`${message.author}, Removed all warnings (${warningnum}) from \`${target.user.tag}\``)

											m.edit(`${message.author}, Removed warn ${count}/${warningnum} \`${target.user.tag}\``);

											count = count + 1;

										});

									});

								});

							}

						}

					});

				});

			});

		} else {

			message.reply("Insufficent permissions.");

		}

	} else {

		message.reply("Please **mention** a valid user.");

	}

}

module.exports.help = {

	name: "clearwarn"

}
