/*
 * The route for the api for checking if a username is taken
 * from the client side.
 */
var db = require('../../db.js').Database;
var fourOhFourRoute = require('../fourohfour.js').route;

/* SQL Queries */
var SQL_CHECK_USERNAME = "SELECT id FROM users WHERE name LIKE $1 LIMIT 1";

/* Checks if the given username is in use.
 */
exports.checkUsername = function(username, callback) {

    db.get(function(err, conn) {
        if(err) {
            callback(err, null);
        }

        conn.query(SQL_CHECK_USERNAME, [username], function(err, res) {
            db.release(conn);

            if(err) {
                callback(err, null);
            }

            var userExists = !! res.rows.length;

            callback(null, userExists);

        });

    });

};

exports.route = function(request, response, data) {

    if(!request.params.username) {
        // Doesn't make sense if no username is given
        return fourOhFourRoute(request, response);
    } 

    exports.checkUsername(request.params.username,
            function(err, usernameExists) {
                if(err) {
                    console.error(err);
                    fourOhFourRoute(request, response);
                } else {
                    data.username_exists = usernameExists;
                    response.json(data);
                }

            });

};
