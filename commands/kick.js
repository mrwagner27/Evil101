const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix, content) => {

	let name = args[0];

	var reason;

	if(!reason) {

		reason = "No reason specified";

	} else {

		reason = message.content.substr(5+prefix.length+args[0].length);

	}

	if(message.member.hasPermission("KICK_MEMBERS")) {

		let kickeduser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

		if(!kickeduser) {

			marray = message.guild.members.filter(m => RegExp(name, "gi").test(m.displayName));

			kickeduser = marray.first();

		}

		if(!kickeduser) return message.reply("Couldn't find this user!")

		if(message.member.highestRole.position <= kickeduser.highestRole.position) return message.reply("This user is too high up in this guilds' hierarchy to be kicked by you!");

		message.guild.member(kickeduser).kick()

		try {

		await kickeduser.send(`You were kicked in ${message.guild.name} for \`${reason}\` by ${message.author.username}`)

			

		}

		catch (e) {

			await message.reply("Couldn't DM this user to tell them they were kicked.")

		}

		        			message.react("✅");



	} else return message.reply("You do not have permission to kick members!");

	return;

}



module.exports.help = {

	name: "kick"

}
