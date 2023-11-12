const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
        data: new SlashCommandBuilder()
                .setName('ahsetchannelrealm')
                .setDescription('Sets the realm to use on this specific channel (Lordaeron,Icecrown)')        
                .addStringOption(option =>
                        option
                                .setName('realm')
                                .setDescription('The realm to use on this server (Lordaeron,Icecrown)')
                                .setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
};
