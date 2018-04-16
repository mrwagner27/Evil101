const Discord = require("discord.js");

module.exports.run = async (bot, message, args, prefix) => {

	var reason;

	let name = `${args[0]}`;

	if(!reason) {

		reason = "No reason specified";

	} else {

		reason = message.content.substr(8+prefix.length+args[0].length);

	}

	if(message.member.hasPermission("BAN_MEMBERS")) {

		let buser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

		if(!buser) {

			let marray = message.guild.members.filter(m => RegExp(name, "gi").test(m.displayName));

			buser = marray.first();

		}

		if (!buser) return message.reply("Couldn't find this user!");

		if (message.member.highestRole.position <= buser.highestRole.position) return message.reply("This user is too high up in this guilds' hierarchy to be banned by you!");

		try {

		await buser.send(`You were soft-banned in ${message.guild.name} for \`${reason}\` by ${message.author.username}`)

		}

		catch (e) {

			await message.reply("Couldn't DM this user to tell them they were softbanned.")

		}

			message.guild.member(buser).ban(7)

        message.guild.unban(buser.id);

      	message.react("✅");

    	

		

		

		

		

	} else return message.reply("You do not have permission to soft-ban members!");

	return;

}



module.exports.help = {

	name: "softban"

}
