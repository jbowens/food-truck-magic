/*
 * Stores and caches user information. If you need a user object,
 * this is the place to get it.
 */

var db = require('./db.js').Database;

/* SQL Queries */
var SQL_GET_USER_BY_ID = 'SELECT * FROM users WHERE id = $1';
var SQL_GET_USER_BY_URL_ID = 'SELECT * FROM users WHERE name = $1';

/* Returns a callback that can be used as a callback to 
 * query. It will call the given callback with the first
 * row of the query output.
 */
function returnFirstQueryRow(callback) {
    return function(err, res) {
        if(err) {
            console.error(err);
            callback(null);
            return;
        }

        if(res && res.rowCount) {
            callback(res.rows[0]);
        } else {
            callback(null);
        }
    };
}

exports.UserStore = {

    /* Retrieves an object representing the user with the
     * given id.
     */
    getById: function(userid, callback) {
        db.get(function(err, conn) {
            if(err) {
                console.error(err);
                callback(null);
                return;
            }

            conn.query(SQL_GET_USER_BY_ID, [userid], returnFirstQueryRow(callback));
        });
    },

    /* Retrieves an object representing the user with the
     * given username.
     */
    getByUsername: function(username, callback) {
        db.get(function(err, conn) {
            if(err) {
                console.error(err);
                callback(null);
                return;
            }

            conn.query(SQL_GET_USER_BY_USERNAME, [username], returnFirstQueryRow(callback));
        });
    }

};
