const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
        data: new SlashCommandBuilder()
                .setName('ahsearch')
                .setDescription('Searches auction house for item')
                .addStringOption(option =>
                    option
                            .setName('itemstring')
                            .setDescription('The string to search for')
                            .setRequired(true))
};
