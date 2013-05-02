/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , anyDB = require('any-db')
  , twit = require('twit');

var SQL_INSERT_TWEET = 'INSERT INTO tweets(user_id, screen_name, created_at, data) VALUES($1, $2, $3, $4)';
var SQL_GET_TWEETS_BYNAME = 'SELECT data FROM tweets WHERE screen_name=$1 LIMIT 20';
var SQL_GET_TWEETS_BYID = 'SELECT data FROM tweets WHERE user_id=$1 LIMIT 20';
var SQL_GET_TWEETS_ALL = 'SELECT data FROM tweets ORDER BY created_at DESC';

var T = new twit({
    consumer_key: 'MZhomFUKbaBov52TjTZRDQ',
    consumer_secret: 'iZASl2D9nS4mSpVFTEuFo6zjeTORhvZlaRofy7Oo',
    access_token: '46545493-yX4P4T0piRxye2Zf3aFX3UPqgmNM8JCNzeCfOFr9M',
    access_token_secret: 'grz7jEMKOTkJoK4hZLI1OGvSNXFB8kbEO7644AkY'
});

var app = express();
var conn = anyDB.createConnection('sqlite3://twitter.db');

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
    conn.query('CREATE TABLE IF NOT EXISTS tweets (' +
                   'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
                   'user_id TEXT,' +
                   'screen_name TEXT,' +
                   'created_at INTEGER,' +
                   'data TEXT' +
               ')');
});

app.configure('development', function(){
    app.use(express.errorHandler());
});

app.stream = (function() {
    var self = {};

    self.stream = T.stream('statuses/filter', {
        //TODO: Write a script that restarts the server or restarts the stream
        //      when new trucks are added to foodler db. Read new trucks and
        //      fetch twitter id by screen_name.
        //      curr solution: api.twitter.com/1/users/show.xml?screen_name=foo

        follow: [
            '1397819952', //FoodTruckler
            '46545493',   //arthuryidi
            '798964256',  //jackson      
            '431770435',  //ChampMelt      
            '49388300',   //ChezPascal     
            '459852041',  //fancheezical   
            '316628451',  //FlourGirlsTreat
            '143182589',  //LikeNoUdder    
            '222186274',  //MamaKimsKbbq   
            '325662621',  //MijosTacos     
            '397633088',  //Paninoexpress  
            '482343766',  //ploufplouftruck
            '199110002',  //pocolocotacos  
            '88734355',   //ProvCoffeeRoast
            '521835692',  //PVDpops        
            '518082486',  //whereisradish  
            '185426817',  //rockettruck    
            '1093577521'  //SproutTruck    
        ]
    });

    self.stream.on('tweet', function(tweet) {
        if (tweet && tweet.text && tweet.id) {

            //TODO: remove old tweets (2 weeks old)

            var id = tweet.user.id_str 
              , name = tweet.user.screen_name
              , time = (new Date(tweet.created_at)).getTime()
              , data = JSON.stringify(tweet);

            conn.query(SQL_INSERT_TWEET, [id, name, time, data],
                       function (err, res) {
                           if (err)
                               console.error(err);
                       });

           console.log('tweet: ' + tweet.user.screen_name);
        } else {
           console.error('tweet invalid: ' + tweet);
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

    self.getTweets = function(query, callback) {
        var sql
          , value;

        if (query.user_id) {
            sql = SQL_GET_TWEETS_BYID;
            value = query.user_id;
        } else if (query.screen_name) {
            sql = SQL_GET_TWEETS_BYNAME;
            value = query.screen_name;
        } else {
            return callback(400, "Error: Query by user_id or screen_name!<br>" + 
                                 "Ex. localhost:8081/?user_id=46545493");
        }

        var result = [];

        var q = conn.query(sql, [value]);
        q.on('row', function(row){
            result.push(JSON.parse(row.data));
        });

        q.on('end', function(){
            callback(200, result);
        });
    };

    self.getAllTweets = function(callback) {
        var result = [];
        var q = conn.query(SQL_GET_TWEETS_ALL);

        q.on('row', function(row){
            var tweet = JSON.parse(row.data);
            result.push([tweet.user.screen_name, tweet.created_at, tweet.text]);
        });

        q.on('end', function(){
            callback(200, result);
        });
    };

    return self;
})();

app.get('/', function (req, res) {
    //query truck by ?user_id=123 or ?screen_name=foo
    app.stream.getTweets(req.query,
                         function (status, result) {
                              res.send(status, result);
                         });
});

app.get('/all_tweets', function (req, res) {
    app.stream.getAllTweets(function (status, result) {
                              res.send(status, result);
                            });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log("Twitter server listening on port " + app.get('port'));
});
