/*
 * The route for the api for checking if a username is taken
 * from the client side.
 */
var db = require('../../db.js').Database;
var fourOhFourRoute = require('../fourohfour.js').route;

/* SQL Queries */
var SQL_CHECK_USERNAME = "SELECT id FROM users WHERE name LIKE $1 LIMIT 1";

exports.route = function(request, response) {

    if(!request.params.username) {
        // Doesn't make sense if no username is given
        return fourOhFourRoute(request, response);
    } 

    db.get(function(err, conn) {
        if(err) {
            // Couldn't get a database connection.
            console.error(err);
            return fourOhFourRoute(request, response);
        }

        conn.query(SQL_CHECK_USERNAME, [request.params.username], function(err, res) {
            db.release(conn);

            if(err) {
                console.error(err);
                return fourOhFourRoute(request, response);
            }

            var userExists = !! res.rows.length;

            response.json({'username_exists': userExists});

        });

    });

};
