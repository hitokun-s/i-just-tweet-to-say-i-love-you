var express = require('express');
var app = express();

app.get("/love.json", function(req,res){
    res.header("Access-Control-Allow-Origin", "*");
    res.json(json);
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
var twit = new Twitter(twitter_keys);

var lovewords = [
    "I love you",
    "愛してる",
    "大好き",
    "我爱你",
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

twit.stream('statuses/filter', {'track': lovewords}, function (stream) {
    stream.on('data', function (data) {
        if(data.text.substr(0,2) === "RT")return; // ignore retweet
        if(data.lang === "en" && data.text.search(/i love you/i) == -1)return
        count++;
        if(isTimeToShow()){
            json = {
                created_at:data.created_at,
                text:data.text,
                user:{
                    screen_name:data.user.screen_name,
                    location:data.user.location,
                    profile_image_url:data.user.profile_image_url
                },
                new_tweet_count:count
            }
            count = 0;
        }
    });
});
