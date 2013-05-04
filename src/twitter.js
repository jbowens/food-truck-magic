/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , fs = require('fs')
  , db = require('./db.js').Database
  , config = require('./config.js').Config
  , anyDB = require('any-db')
  , twit = require('twit')
  , colors = require('colors');

var SQL_INSERT_TWEET = 'INSERT INTO tweets(truckid, createdat, data)' +
                       ' SELECT trucks.id, $2, $3 FROM trucks' +
                       ' WHERE trucks.twitterid=$1';
var SQL_TWITTER_IDS = 'SELECT twitterid FROM trucks WHERE twitterid IS NOT NULL';

var T = new twit({
    consumer_key: 'MZhomFUKbaBov52TjTZRDQ',
    consumer_secret: 'iZASl2D9nS4mSpVFTEuFo6zjeTORhvZlaRofy7Oo',
    access_token: '46545493-yX4P4T0piRxye2Zf3aFX3UPqgmNM8JCNzeCfOFr9M',
    access_token_secret: 'grz7jEMKOTkJoK4hZLI1OGvSNXFB8kbEO7644AkY'
});

var app = express();

app.configure(function(){
    app.set('port', process.env.PORT_TWITTER || 8081);
    app.use(function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        return next();
    });
    //app.use(express.logger('dev'));
    app.use(express.methodOverride());
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

var TwitterAPI = {
    stream: null,
    updated: false,

    init: function(twitterids) {
        TwitterAPI.stream = T.stream('statuses/filter', {
            //TODO: restart the stream when new trucks are added to foodler db
            //      Read new trucks and fetch twitter id by screen_name. It would be
            //      better to lookup the user id and store it in the foodler db during
            //      registration.

            follow: twitterids
        });

        TwitterAPI.stream.on('tweet', function(tweet) {
            if (tweet && tweet.text && tweet.id) {

            //TODO: remove old tweets (2 weeks old)

                var id = tweet.user.id_str 
                , name = tweet.user.screen_name
                , time = (new Date(tweet.created_at)).getTime()
                , data = JSON.stringify(tweet);

                db.query(SQL_INSERT_TWEET, [id, time, data],
                         function (err, res) {
                             if (err)
                                 console.error(err);
                         });

                         console.log(String('tweet: ' + tweet.user.screen_name).green);
            } else {
                console.error(String('tweet invalid: ' + tweet).red);
            }
        });

        TwitterAPI.stream.on('disconnect', function(message) {
            console.log('Disconnected from Twitter'.red);
            console.log('It\'s Jackson, Alec, or Arthur\'s fault!\nOnly one person at a time.'.red);

            //TODO: if disconnected wait 10 seconds and reconnect
        });
    },

    getUserData: function(screen_name, callback) {
        if(screen_name.length === 1) {
            //single lookup
            T.get('users/show', { 'screen_name' : screen_name }, function(err, data) {
                callback(err, data);
            });
        } else {
            //bulk lookup
            T.get('users/lookup', { 'screen_name' : screen_name }, function(err, data) {
                callback(err, data);
            });
        }
    }

    restart: function() {
        console.log("twitter restart".green);
        TwitterAPI.steam.stop();
        TwitterAPI.init();
    }
};

config.init(function() {
    db.init();
    db.query(SQL_TWITTER_IDS, [], function(err, resp) {
        if(err)
            console.log("ohh god".red);

        TwitterAPI.init(resp.rows.map(function(row) {
            return row.twitterid; 
        }));
        //TwitterAPI.init(resp.rows.twitterids);
    });
});

app.get('/lookup/', function (req, res) {
    if(req.query.user_id) {
        //TODO: implement
    } else if(req.query.screen_name) {
        //TODO: errors
        TwitterAPI.getUserData(req.query.screen_name.split(','), function(err, data) {
            res.send(400, data);
        });
    } else {
        res.send(400, "Unable to Process Request");
    }
});

app.get('/update', function() {
    TwitterAPI.updated = true;
});


var checkUpdateStream = function() {
    if (TwitterAPI.updated) {
        TwitterAPI.updated = false;
        TwitterAPI.restart();
    }
}

http.createServer(app).listen(app.get('port'), function(){
    console.log(String("Twitter server listening on port " + app.get('port')).blue);

    setInterval(checkUpdateStream, 60 * 100);
});
