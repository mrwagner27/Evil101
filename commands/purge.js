const Discord = require("discord.js");

module.exports.run = async (bot, message, args) => {

	if(message.member.hasPermission("MANAGE_MESSAGES")) {

		let num = parseInt(args[0]);

		if(!num) return message.reply("You must provide the number of messages to delete!");

		if(num > 99) return message.reply("You can only purge 99 messages at a time!");

		message.channel.bulkDelete(num + 1)

			.then(messages => message.reply(`Deleted ${messages.size - 1} messages that were not over two weeks old!`))

			.catch(console.error);

	} else return message.reply(`You do not have permission to purge messages!`);

}



module.exports.help = {

	name: "purge"

}
