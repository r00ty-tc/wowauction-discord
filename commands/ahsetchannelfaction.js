const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
        data: new SlashCommandBuilder()
                .setName('ahsetchannelfaction')
                .setDescription('Sets the faction to use on this specific channel (h or a)')
                .addStringOption(option =>
                        option
                                .setName('faction')
                                .setDescription('The faction to use on this server (h or a)')
                                .setRequired(true))
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
};
