const Discord = require("discord.js");

const ms = require("ms");

module.exports.run = async (bot, message, args) => {

        let name = `${args[0]}`

        if(message.member.hasPermission("KICK_MEMBERS")) {

                let tounmute = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));

                if(!tounmute) {

                        marray = message.guild.members.filter(m => RegExp(name, "gi").test(m.displayName))

                        tounmute = marray.first()

                }

                if(!tounmute) return message.reply("Couldn't find this user.")

                if(message.member.highestRole.position <= tounmute.highestRole.position) return message.reply("This user is too high up in this guilds' hierarchy to be unmuted by you!");



                let muterole = message.guild.roles.find(`name`, "Muted");

                if(tounmute.roles.has(muterole.id)) {

                        tounmute.removeRole(muterole)

                        message.react("\u2705")

                } else return message.reply("This user is not muted!")

        }

}

module.exports.help = {

        name: "unmute"

}
