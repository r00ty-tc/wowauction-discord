/**
 this works only with warmane
**/
const Discord = require('discord.js');
var request= require('request');
const client = new Discord.Client();
var prefix = '?gl';
var base_url = "https://web-auctioneer.com/guildlog";

client.on("message", function(message) {
    if (!message.guild) return;
    if(message.author.bot) return;

    if(!message.content.startsWith(prefix))
        return;
    var gid = message.guild.id;
	var cid = message.channel.id;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    console.log(message.content);
    const command = args.shift().toLowerCase();
    console.log(command,gid);
    if(command == 'ping')
        message.channel.send("Pong!");
    else if(command == 'guild'){
        member =  message.guild.member(message.author);
        if(member.hasPermission(Discord.Permissions.FLAGS.MANAGE_CHANNELS)){
			
			gname = args.join("+");
            var url = base_url+"/saveguild?gid="+gid+"&cid="+cid+"&gname="+gname;
			console.log(url);
            request(url,{json:true},function (err,res,body) {
                if(err){ return console.log(err); }
                console.log(body);
                var obj = body;
                if(obj.result  == "OK"){
                    message.channel.send("Guild logging set to **"+obj.name+"** from realm **"+obj.realm+"**");
                } else {
                    message.channel.send("**"+obj.message+"**");
                }
            });
        }
        else {
            message.channel.send("OPPS You cant do that Dave.");
        }
    }
    else if(command == "online"){
		var url = base_url+"/onlinelist?gid="+gid;
		console.log(url);
		request(url,{json:true},function (err,res,body) {
			if(err){ return console.log(err); }
			var obj = body;
			if(obj.result  == "OK"){
				var out = "";
				for(var i=0; i < obj.response.length; i++){
					out += ":large_blue_diamond: "+obj.response[i].name+ "*("+obj.response[i].rank+")* \n";
				}
				if(out == ""){
					message.channel.send("No Players found online, if you recently added this guild please wait a few minutes.");
				}
				else {
					message.channel.send(out);
				}
			} else {
				message.channel.send("**"+obj.message+"**");
			}
		});		
	}
	else if(command == "start"){
		var url = base_url+"/startchannel?gid="+gid+"&cid="+cid;
		request(url,{json:true},function (err,res,body) {
			if(err){ return console.log(err); }
			var obj = body;
			if(obj.result  == "OK"){
				var out = "Guild log will now be displayed in this **"+message.channel.name+"**";
				message.channel.send(out);
			} else {
				message.channel.send("**"+obj.message+"**");
			}
		});		
		
	}
	else if(command == "stop"){
		var url = base_url+"/stopchannel?gid="+gid+"&cid="+cid;
		request(url,{json:true},function (err,res,body) {
			if(err){ return console.log(err); }
			var obj = body;
			if(obj.result  == "OK"){
				var out = "Guild log purged and stopped on this server. To start again please use ?gl setup";
				message.channel.send(out);
			} else {
				message.channel.send("**"+obj.message+"**");
			}
		});
	}
	else {
		message.channel.send("**Warmane Guild Logger**\n A Discord utility that allows you to monitor activity in the guild \n **Activities monitored**\n - Rank Changes\n - Players joining and leaving \n **Usage** \n To setup use ?gl guild *realm*,*guild name* \n To get Online players : ?gl online \n To Stop announcements on a channel ?gl stop \n To Start Announcement in a channel ?gl start \n ?gl stop will remove your guild from our server and delete all the information we have stored.");
	}
});
client.login("<app client key>");
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