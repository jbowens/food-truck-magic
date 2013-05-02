/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , twit = require('twit')
  , path = require('path');

var T = new twit({
    consumer_key: 'MZhomFUKbaBov52TjTZRDQ',
    consumer_secret: 'iZASl2D9nS4mSpVFTEuFo6zjeTORhvZlaRofy7Oo',
    access_token: '46545493-yX4P4T0piRxye2Zf3aFX3UPqgmNM8JCNzeCfOFr9M',
    access_token_secret: 'grz7jEMKOTkJoK4hZLI1OGvSNXFB8kbEO7644AkY'
});

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT_TWITTER || 8080);

    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        return next();
    });

    //app.use(express.logger('dev'));
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.stream = (function() {
    var self = {},
        tweets = [];

    self.stream = T.stream('statuses/filter', {
        //arthuryidi, jackson, chez pascal, mama kim
        follow: [ '46545493', '798964256', '49388300', '222186274' ]
    });

    self.stream.on('tweet', function(tweet) {
        //TODO: sort the tweets by user in an obj. lit
        //preferably store in a db
        if (tweet && tweet.text && tweet.id) {
            tweets.push(tweet);
            if (tweets.length > 2000) {
                tweets = tweets.slice(1000);
            }
        } else {
            console.log('Tweet invalid: ' + tweet);
        }
    });

    //this.stream.on('limit', function(message) {
    //    console.log(message);
    //});

    //this.stream.on('connect', function(message) {
    //    console.log('Connected');
    //});

    //this.stream.on('disconnect', function(message) {
    //    console.log('Disconnected');
    //});

    //this.stream.on('warning', function(message) {
    //    console.log(message);
    //});

    self.getTweets = function(id) {
        var result = [];

        for (var i = 0; i < tweets.length; ++i) {
            result.push(tweets[i]);
        }

        if (result.length > 25) {
            return result.slice(result.length - 25);
        } else {
            return result;
        }
    };

    return self;
})();

app.get('/:username', function (req, res) {
    console.log(req.query);
    res.send(200, app.stream.getTweets(req.params.username));
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Twitter server listening on port " + app.get('port'));
});
