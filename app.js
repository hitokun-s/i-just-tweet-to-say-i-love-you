var express = require('express');

var app = express();

var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }))
app.use( bodyParser.json() );

app.get("/love.json", function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.json(json);
});

var http = require('http');
app.post("/proxy", function(req, res){

    var params = [];
    for(var k in req.body){
        params.push( k + "=" + req.body[k] );
    }
    var slash_idx = req.query.url.indexOf("/");

    var options ={
        host: req.query.url.substring(0, slash_idx),
        port: 80,
        path: "/" + req.query.url.substring(slash_idx + 1) + "?" + params.join("&"),
        //headers: {
        //    "content-type": "application/xml",
        //},
        method: 'GET'
    }

    var req = http.request(options, function(proxy_res) {
        var output = '';
        proxy_res.setEncoding('utf8');
        proxy_res.on('data', function (chunk) {
            output += chunk;
        });
        proxy_res.on('end', function() {
            //var obj = JSON.parse(output);
            res.header("Access-Control-Allow-Origin", "*");
            res.statusCode = proxy_res.statusCode;
            res.send(output);
        });
    });
    req.on('error', function(err) {
        res.send(err.message);
    });
    req.end();
});

//app.use(express.static(path.join(__dirname, 'public')));

var json = {};
var count = 0;

app.listen(8080);

module.exports = app;

var isTimeToShow = function(){
    var lasttime = new Date().getTime();
    return function(){
        var nowtime = new Date().getTime();
        if(nowtime - lasttime > 800){
            lasttime = nowtime;
            return true
        }
        return false
    }
}();

var Twitter = require('ntwitter')

var twitter_keys = require('./twitter_keys.json');
//var twit = new Twitter(twitter_keys);

var lovewords = [
    "I love you",
    "愛してる",
    "大好き",
//    "我爱你",
    "사랑해요",
    "ผมรักคุณ", // Thai from a man
    "ฉันรักคุณ", // Thai from a woman
    "Anh yêu em", // Vietnam from a man
    "Em yêu anh", // Vietnam from a woman
    "Saya chinta padamu",// Indonesia
    "Би чамд хайртай", // Mongol
    "मैं तुम्हैं प्यार करता हुँ", // HIndu from a man
    "मैं तुमसे प्यार करती हुँ", // Hindu from a woman
    "Seni seviyorum", // Turkey
    "Я тебя люблю", // Russia
    "Σ' αγαπώ" , // Greece
    "Ti amo", // Italy
    "Je t'aime" , // France
    "Te amo", // Spain
    "Ich liebe dich" , // German
    "Ik hou van je" , // Dutch
    "Eu te amo" , // Portugal
    "Jag älskar dig" , // Sweden
    "Minä rakastan sinua" // Finland
]

//twit.stream('statuses/filter', {'track': lovewords}, function (stream) {
//    stream.on('data', function (data) {
//        if(data.text.substr(0,2) === "RT")return; // ignore retweet
//        if(data.lang === "en"){
//            if(data.text.search(/i love you/i) == -1)return;
//        }
//        count++;
//        if(isTimeToShow()){
//            json = {
//                created_at:data.created_at,
//                text:data.text,
//                user:{
//                    screen_name:data.user.screen_name,
//                    location:data.user.location,
//                    profile_image_url:data.user.profile_image_url
//                },
//                new_tweet_count:count
//            }
//            count = 0;
//        }
//    });
//});
