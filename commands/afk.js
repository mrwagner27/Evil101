module.exports.run = async (bot, message, args, prefix, content) => {
	let afkmsg = args.join(" ");
	if (!afkmsg) afkmsg = "No reason provided.";
	let channel = bot.channels.find(`id`, "422201325623836682");
	channel.send(`${message.author.id} ${afkmsg}`);

	message.reply(`You are now AFK!: \`${afkmsg}\`\nTo become un-AFK, just talk again!`);
	message.delete()

}
module.exports.help = {
	name: "afk"

}
