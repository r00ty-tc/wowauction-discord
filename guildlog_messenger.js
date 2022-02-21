const Discord = require('discord.js');

var request= require('request');
const client = new Discord.Client();
var prefix = '?gl';
var base_url = "https://web-auctioneer.com/guildlog";

client.login("<app client id>");

setInterval(function(){
	var url = base_url+"/getevents";
	request(url,{json:true},function (err,res,body) {
		if(err){ return console.log(err); }
		console.log(body);
		var objs = body;
		if(objs.length > 0){
			for(i=0; i < objs.length; i++){
				obj = objs[i]
				channel = client.channels.find('id',obj.cid);
				if(channel){
					channel.send("**"+obj.char_name+"**("+obj.char.level+") *"+obj.char.race+","+obj.char.class+"* has **"+obj.operation+"** \n "+obj.extra);
				}				
			}
		}
	});
},1000);