const Discord = require("discord.js");



module.exports.run = async (bot, message, args, content) => {

	if(!message.member.hasPermission("MANAGE_ROLES")) return message.reply("You do not have permissions to use this command. Requires `MANAGE ROLES` permission.");

	if(args[0] === undefined) return message.reply("Please specify a target. Example: `!giverole @user role`.").catch(function() {})

	var target = message.guild.members.find(member => member.user.tag.toLowerCase().startsWith(args[0].toLowerCase()) || member.user.id === args[0] || message.mentions.users.first() === member.user);

	if(target === null) return message.reply("Please specify a valid target.").catch(function() {});

	if(args[1] === undefined) return message.reply("Please specify a role. Example: `!giverole @user role`.").catch(function() {});

	var choice = message.guild.roles.find(role => role.name.toLowerCase().startsWith(args[1].toLowerCase()) || args[1].includes(`${role.id}`));

	if(choice === null) return message.reply("Please specify a valid role.").catch(function() {});

	if(message.member.highestRole.position <= choice.position) return message.reply(`You are not high enough in this guilds hierarchy to give/remove the \`${choice.name}\` role.`);

	if(target.roles.has(choice.id)) {

		target.removeRole(choice).then(() => {

			message.reply(`Successfully removed \`${target.user.tag}\` from the \`${choice.name}\` role.`).catch(function() {});

		}).catch(function() {

			message.reply(`There was an error while removing \`${target.user.tag}\` from the \`${choice.name}\` role.`).catch(function() {});

		});

	} else {

		target.addRole(choice).then(() => {

			message.reply(`Successfully given \`${target.user.tag}\` the \`${choice.name}\` role.`).catch(function() {});

		}).catch(function() {

			message.reply(`There was an error while giving \`${target.user.tag}\` the \`${choice.name}\` role.`).catch(function() {});

		});

	}

}

module.exports.help = {

	name: "role"

}
