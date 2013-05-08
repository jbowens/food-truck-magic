/*
 * Handles all cronjobs (or rather, emulates cronjobs with setinterval)
 */

var db = require('./db.js').Database;
var SQL_UPDATE_TO_CLOSE = 'UPDATE trucks SET open=false WHERE dateclose < now() AND open=true;';
var SQL_REMOVE_OLD_TWEETS = 'DELETE FROM TWEETS WHERE createdat < $1';

/*
 * Checks if open trucks should switch to the closed state
 */
var autoCloseTrucks = function() {
    console.log("Running cron for closing trucks");
    db.query(SQL_UPDATE_TO_CLOSE, [], function(err, res) {
        if (err) {
            console.error(err);
        }
    });
};

/*
 * Tweets in the DB that are over one weeks old are removed
 */
var deleteOldTweets = function() {
    console.log("Running cron for deleting old tweets");
    var date = new Date();
    date.setDate(date.getDate() - 7);
    var time = date.getTime();
    db.query(SQL_REMOVE_OLD_TWEETS, [time], function(err, res) {
        if (err) {
            console.error(err);
        }
    });

};

exports.startCronJobs = function() {
    deleteOldTweets();
    setInterval(autoCloseTrucks, 24*60*60*1000); /* every 24 hours */

    autoCloseTrucks();
    setInterval(autoCloseTrucks, 5*60*1000); /* every 5 minutes */
};
