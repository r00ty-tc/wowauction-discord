const Discord = require('discord.js');
var request= require('request');
const client = new Discord.Client();
var prefix = '?ah';
var base_url = "https://web-auctioneer.com/";
client.on("message", function(message) {
    if (!message.guild) return;
    if(message.author.bot) return;

    if(!message.content.startsWith(prefix))
        return;
    var gid = message.guild.id;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    console.log(message.content);
    const command = args.shift().toLowerCase();
    console.log(command,gid);
    if(command == 'ping')
        message.channel.send("Pong!");
    else if(command == 'setrealm'){
        member =  message.guild.member(message.author);
        if(member.hasPermission(Discord.Permissions.FLAGS.MANAGE_CHANNELS)){
            var realmid = args[0];
            var url = base_url+"/private-api/setrealm?gid="+gid+"&realmid="+realmid;
            request(url,{json:true},function (err,res,body) {
                if(err){ return console.log(err); }
                console.log(body);
                var obj = body;
                if(obj.result  == "OK"){
                    message.channel.send("Realm for this server set to **"+obj.name+"**");
                } else {
                    message.channel.send("**"+obj.message+"**");
                }
            });
        }
        else {
            message.channel.send("OPPS You cant do that Dave.");
        }
    }
    else if(command == 'setfaction'){
        member =  message.guild.member(message.author);
        if(member.hasPermission(Discord.Permissions.FLAGS.MANAGE_CHANNELS)){
            var faction = args[0];
            var url = base_url+"/private-api/setfaction?gid="+gid+"&faction="+faction;
            request(url,{json:true},function (err,res,body) {
                if(err){ return console.log(err); }
                console.log("res" + JSON.stringify(body));
                var obj = body;
                if(obj.result  == "OK"){
                    message.channel.send("Faction for this server set to **"+obj.name+"**");
                } else {
                    message.channel.send("**"+obj.message+"**");
                }
            })
        }
        else {
            message.channel.send("OPPS You cant do that Dave.");
        }
    }
    else {
        var name = command + " "+args.join(" ");
        if(name.length < 3){
            message.channel.send("**Query is too short. Please type a longer query.**");
        }
        var url = base_url+"/private-api/get-ah-price?gid="+gid+"&name="+name;
        request(url,{json:true},function (err,res,body) {
            if(err){ return console.log(err); }
            console.log("res" + JSON.stringify(body));
            var obj = body;
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
                message.channel.send(msg);
            }
            else {
                if(typeof obj != "undefined")
                    message.channel.send("**"+obj.message+"**");
            }
        })
    }
});
client.login("<client key here>");
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
    console.log(amt,g,s,c);
    return out;
}

