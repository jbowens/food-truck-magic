/*
 * Handles all cronjobs (or rather, emulates cronjobs with setinterval)
 */

var db = require('./db.js').Database;
var SQL_UPDATE_TO_CLOSE = 'UPDATE trucks SET open=false WHERE dateclose < now() AND open=true;';

var autoCloseTrucks = function() {
    db.query(SQL_UPDATE_TO_CLOSE, [], function(err, res) {
        if (err) {
            console.error(err);
        }
    });
};

exports.startCronJobs = function() {
    setInterval(autoCloseTrucks, 5*60*1000); /* every 5 minutes */
};
