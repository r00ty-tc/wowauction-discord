const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
        data: new SlashCommandBuilder()
                .setName('ahsetfaction')
                .setDescription('Sets the faction to use on this discord server (h or a)')
                .addStringOption(option =>
                        option
                                .setName('faction')
                                .setDescription('The faction to use on this server (h or a)')
                                .setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
};
