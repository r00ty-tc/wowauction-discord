const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
        data: new SlashCommandBuilder()
                .setName('ahsetrealm')
                .setDescription('Sets the realm to use on this discord server (14=Lordaeron,15=Icecrown,17=Onyxia)')
                .addStringOption(option =>
                        option
                                .setName('realm')
                                .setDescription('The realm to use on this server (14=Lordaeron,15=Icecrown,17=Onyxia)')
                                .setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
};
