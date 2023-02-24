const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
        data: new SlashCommandBuilder()
                .setName('ahlistguilds')
                .setDescription('Lists registered guilds using the bot')
                .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
};
