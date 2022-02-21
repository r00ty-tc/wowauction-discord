const Discord = require('discord.js');
var request= require('request');
const client = new Discord.Client();
//var base_url = "https://web-auctioneer.com/";
var base_url = "http://wowauction:8080/";
client.login("<app client key here>");

setInterval(function(){
    var url = base_url+"/private-api/discordnotifications";
    console.log(url);
    request(url,{json:true},function (err,res,body) {
        if (err) {
            return console.log(err);
        }
        console.log("res" + JSON.stringify(body));
        var obj = body;
        if (obj.status == 1 && obj.response.length > 0) {
            for(var i=0; i < obj.response.length; i++){
                var user = client.users.find('tag',obj.response[i].user);
                if(user) {
                    user.send(obj.response[i].body);
                }
                else {
                    console.log("User with tag "+obj.response[i].user+" not found");
                }
            }
        }
    });
},5000);

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
