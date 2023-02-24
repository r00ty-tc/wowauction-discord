const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
        data: new SlashCommandBuilder()
                .setName('ahsetrealm')
                .setDescription('Sets the realm to use on this discord server (Lordaeron)')        
                .addStringOption(option =>
                        option
                                .setName('realm')
                                .setDescription('The realm to use on this server (Lordaeron)')
                                .setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
};
