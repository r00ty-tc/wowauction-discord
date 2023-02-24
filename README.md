# wowauction-discord

This is the discord integration of the wowauction website.

The main script is the discord_bot.js. THis is the one that will create the bot on discord and then process requests when you receive commands.

the other scripts like guildlog and guildlog_messenger only work with warmane armory api. Its not used and not maintained. 

discord_bot.js has been upgraded to use slash (/) commands. After cloning you should run 'npm install' to install dependencies and then copy config.json.dist to config.json and set it up for your discord/endpoint details.
