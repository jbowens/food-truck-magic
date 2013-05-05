/*
 * Handles logic for dealing with the twitter db table
 */
var db = require('./db.js').Database;

/* SQL Queries */
var SQL_GET_RECENT_TWEETS = 'SELECT * FROM tweets WHERE truckid = $1 ORDER BY creadedat DESC LIMIT '; /* NOTE THE FUCKING LIMIT */

/* Gets the most recent tweets for the truck.
 */
exports.getMostRecent = function(truckid, tweetsToGet, callback) {
    db.query(SQL_GET_RECENT_TWEETS + tweetsToGet.toString(), 
             [truckid], 
             function(err, res) {
                if(err) {
                    console.error(err);
                    return callback(err, []);
                }
    
                callback(null, res.rows.map(function(x) {
                    return JSON.parse(x.data);            
                });
                
            });

};
