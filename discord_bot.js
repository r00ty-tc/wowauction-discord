const { Client, Events, GatewayIntentBits } = require('discord.js');

const bent = require('bent');
const getJSON = bent('json');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Read configuration
const { token, baseUrl } = require('./config.json');

// On interaction event
client.on(Events.InteractionCreate, async interaction => {
    // If the interaction is not a command, do nothing
    if (!interaction.isChatInputCommand()) return;

    // Handle set realm command
    if (interaction.commandName === 'ahsetrealm') {
        // This gives us a bit more time to reply (in case DB is loaded)
        await interaction.deferReply();

        // Get realm ID from parameter, guild (server) id from interaction
        var realmid = interaction.options.getString('realm');
        var guildId = interaction.guildId;

        // Generate URL
        var url = baseUrl + "/private-api/setrealm?gid=" + guildId + "&realmid=" + realmid;

        try {
            // call api to update realm
            const response = await getJSON(url);

            // If OK report success to user, else report failure
            if(response.result == "OK"){
                await interaction.editReply("Realm for this server set to **" + response.name + "**");
            } else {
                await interaction.editReply("**" + response.message + "**");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    // Handle set faction command
    else if(interaction.commandName == 'ahsetfaction') {
        // This gives us a bit more time to reply (in case DB is loaded)
        await interaction.deferReply();

        // Get faction from parameter and guild (server) id from interaction
        var faction = interaction.options.getString('faction');
        var guildId = interaction.guildId;

        // Generate URL
        var url = baseUrl + "/private-api/setfaction?gid=" + guildId + "&faction=" + faction;

        try {
            // call api to update faction
            const response = await getJSON(url);

            // If OK report success to user, else report failure
            if(response.result  == "OK"){
                await interaction.editReply("Faction for this server set to **" + response.name + "**");
            } else {
                await interaction.editReply("**" + response.message + "**");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    // Handle search command
    else if (interaction.commandName == 'ahsearch') {
        // This gives us a bit more time to reply (in case DB is loaded)
        await interaction.deferReply();

        // Get the search term and validate it
        var searchTerm = interaction.options.getString('itemstring');
        if(searchTerm.length < 3){
            message.channel.send("**Query is too short. Please type a longer query.**");
        }

        // Get guild id, guild name and user name.
        var guildId = interaction.guildId;
        var guildName = interaction.guild.name;
        var userName = interaction.user.tag;

        // Generate URL
        var url = baseUrl + "/private-api/get-ah-price?gid=" + guildId + "&name=" + searchTerm;

        // Log the seach info to the console
        console.log("From: " + guildId + " (" + guildName + ") /" + userName + " for " + searchTerm);

        try {
            // Perform the query against the api
            const response = await getJSON(url);

            if(response.result  == "OK"){
                // If response is OK then generate response message
                var replyMessage = "";
                replyMessage += "**Auction Data (Found " + response.matches.length + " items)**\n";
                replyMessage += "Realm ***" + response.realm_name + "*** on ***" + response.server_name + "*** **" + response.faction + "** faction\n";
                var l = response.matches.length;
                if(l > 3)
                    l = 3;
                for(var i =0; i < l; i++){
                    replyMessage += "Name : **" + response.matches[i].name + "**\n";
                    replyMessage += "Median Bid Amount : **" + currency(parseInt(response.matches[i].bid_median)) + "**\n";
                    replyMessage += "Median Buyout Amount : **" + currency(parseInt(response.matches[i].buyout_median)) + "**\n";
                    replyMessage += "Minimum Bid Found : **" + currency(parseInt(response.matches[i].bid_min)) + "**\n";
                    replyMessage += "Minimum Buyout Found : **" + currency(parseInt(response.matches[i].buyout_min)) + "**\n";
                    replyMessage += "Quantity : **" + response.matches[i].quantity + "**\n";
                    var trend = "";
                    if(response.matches[i].trend > 0)
                        trend = " :arrow_up: ";
                    else
                        trend = " :arrow_down: ";

                    replyMessage += "Trend : **" + trend + "(" + Math.floor(response.matches[i].trend * 100) + "%)**\n";
                    replyMessage += "Last Updated : " + response.matches[i].ago + "\n";
                    replyMessage += "Link : " + response.matches[i].link + "\n ---------------------------------\n";
                }

                // Send message to user
                await interaction.editReply(replyMessage);
            }
            else {
                // Otherwise report error
                if(typeof response != "undefined")
                await interaction.editReply("**" + response.message + "**");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    // Handle command to list guilds (servers) using the bot. Only for main channel
    else if (interaction.commandName == 'ahlistguilds') {
        // Create message with header
        var replyMessage = "**Listing guilds using this bot**\n";
        replyMessage += "```Guild ID----------------- Name---------------------------------------------- Members---\n";

        // Handle each guild entry
        client.guilds.cache.forEach(function(thisGuild)
        {
            // Generate a line for this guild/server
            var guildId = (thisGuild.id.padEnd(25, ' '));
            var guildName = (thisGuild.name.padEnd(50, ' '));
            var guildMembers = (thisGuild.memberCount.toString().padStart(10, ' '));
            replyMessage += guildId + " " + guildName + " " + guildMembers + "\n";
        });

        // Generate the footer
        replyMessage += "```\n";
        replyMessage += client.guilds.cache.size.toString() + " guild(s)";

        // Send the message
        interaction.reply(
            {
                content: replyMessage, ephemeral: true
            });
    }
});

// Login to discord with bot token
client.login(token);

// Format gold amount for discord messages
function currency(amt){
    var c = amt % 100;
    var c2 = Math.floor(amt / 100);
    var s = c2 % 100;
    c2 = Math.floor(c2 / 100);
    var g = c2;
    var out = "";
    if(g > 0)
        out += g + ":small_orange_diamond: ";
    if(s > 0)
        out += s + ":small_blue_diamond: ";
    if(c > 0)
        out += c + "C";
    return out;
}

// Handle exit/kill by disconnecting
process.on('SIGINT', () => {
    console.log("Closing down");
    client.destroy();
    process.exit();
});