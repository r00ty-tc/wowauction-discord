const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
        data: new SlashCommandBuilder()
                .setName('ahsetchannelrealm')
                .setDescription('Sets the realm to use on this specific channel (14=Lordaeron,15=Icecrown,17=Onyxia)')
                .addStringOption(option =>
                        option
                                .setName('realm')
                                .setDescription('The realm to use on this specific channel (14=Lordaeron,15=Icecrown,17=Onyxia)')
                                .setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
};
