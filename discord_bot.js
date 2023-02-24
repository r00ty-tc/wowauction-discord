const { Client, Events, GatewayIntentBits } = require('discord.js');

const bent = require('bent');
const getJSON = bent('json');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const { token, baseUrl } = require('./config.json');

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if (interaction.commandName === 'ahsetrealm') {
        await interaction.deferReply();
        var realmid = interaction.options.getString('realm');
        var gid = interaction.guildId;
        var url = baseUrl+"/private-api/setrealm?gid="+gid+"&realmid="+realmid;

        try {
            const obj = await getJSON(url);
            if(obj.result  == "OK"){
                await interaction.editReply("Realm for this server set to **"+obj.name+"**");
            } else {
                await interaction.editReply("**"+obj.message+"**");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    else if(interaction.commandName == 'ahsetfaction') {
        await interaction.deferReply();
        var faction = interaction.options.getString('faction');
        var gid = interaction.guildId;
        var url = baseUrl+"/private-api/setfaction?gid="+gid+"&faction="+faction;

        try {
            const obj = await getJSON(url);
            if(obj.result  == "OK"){
                await interaction.editReply("Faction for this server set to **"+obj.name+"**");
            } else {
                await interaction.editReply("**"+obj.message+"**");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    else if (interaction.commandName == 'ahsearch') {
        await interaction.deferReply();
        var name = interaction.options.getString('itemstring');
        if(name.length < 3){
            message.channel.send("**Query is too short. Please type a longer query.**");
        }
        var gid = interaction.guildId;
        var gname = interaction.guild.name;
        var uid = interaction.user.tag;
        var url = baseUrl+"/private-api/get-ah-price?gid="+gid+"&name="+name;

        console.log("From: "+gid+" ("+gname+") /"+uid+" for "+name);

        try {
            const obj = await getJSON(url);
            if(obj.result  == "OK"){
                var msg = "";
                msg += "**Auction Data (Found "+obj.matches.length+" items)**\n";
                msg += "Realm ***"+obj.realm_name+"*** on ***"+obj.server_name+"*** **"+obj.faction+"** faction\n";
                var l = obj.matches.length;
                if(l > 3)
                    l = 3;
                for(var i =0; i < l; i++){
                    msg += "Name : **"+obj.matches[i].name+"**\n";
                    msg += "Median Bid Amount : **"+currency(parseInt(obj.matches[i].bid_median))+"**\n";
                    msg += "Median Buyout Amount : **"+currency(parseInt(obj.matches[i].buyout_median))+"**\n";
                    msg += "Minimum Bid Found : **"+currency(parseInt(obj.matches[i].bid_min))+"**\n";
                    msg += "Minimum Buyout Found : **"+currency(parseInt(obj.matches[i].buyout_min))+"**\n";
                    msg += "Quantity : **"+obj.matches[i].quantity+"**\n";
                    var trend = "";
                    if(obj.matches[i].trend > 0)
                        trend = " :arrow_up: ";
                    else
                        trend = " :arrow_down: ";

                    msg += "Trend : **"+trend+"("+Math.floor(obj.matches[i].trend*100)+"%)**\n";
                    msg += "Last Updated : "+obj.matches[i].ago+"\n";
                    msg += "Link : "+obj.matches[i].link+"\n ---------------------------------\n";
                }
                await interaction.editReply(msg);
            }
            else {
                if(typeof obj != "undefined")
                await interaction.editReply("**"+obj.message+"**");
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    else if (interaction.commandName == 'ahlistguilds') {
        var msg = "**Listing guilds using this bot**\n";
        msg+= "```Guild ID----------------- Name---------------------------------------------- Members---\n";
        client.guilds.cache.forEach(function(thisGuild)
        {
            var guildId = (thisGuild.id.padEnd(25, ' '));
            var guildName = (thisGuild.name.padEnd(50, ' '));
            var guildMembers = (thisGuild.memberCount.toString().padStart(10, ' '));
            msg+= guildId + " " + guildName + " " + guildMembers + "\n";
        });
        msg+= "```\n";
        msg+= client.guilds.cache.size.toString()+" guild(s)";

        interaction.reply(
            {
                content: msg, ephemeral: true
            });
    }
});

client.login(token);
function currency(amt){
    var c = amt%100;
    var c2 = Math.floor(amt/100);
    var s = c2%100;
    c2 = Math.floor(c2/100);
    var g = c2;
    var out = "";
    if(g > 0)
        out += g+":small_orange_diamond: ";
    if(s > 0)
        out += s+":small_blue_diamond: ";
    if(c > 0)
        out += c+"C";
    return out;
}

process.on('SIGINT', () => {
    console.log("Closing down");
    client.destroy();
    process.exit();
});