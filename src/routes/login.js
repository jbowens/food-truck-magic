/*
 * The route for the /login page.
 */
var _ = require('underscore');
var db = require('../db.js').Database;
var hash = require('../hasher.js').hash;
var sanitize = require('validator').sanitize;
var bailout = require('./fatalerror.js').bailout;
var errorout = require('./error.js').errorout;

/* SQL Queries */
var SQL_GET_USER = 'SELECT * FROM users WHERE name = $1 AND pass = $2';
var SQL_GET_USERS_TRUCK = 'SELECT truckid FROM vendors WHERE userid = $1';

function getUser(username, password, callback) {

    var hashedPassword = hash(password);

    db.get(function(err, conn) {
        if(err) {
            return callback(err, null);
        }

        conn.query(SQL_GET_USER, [username, hashedPassword], function(err, res) {
            db.release(conn);
            
            if(err) {
                console.error(err);
                callback(err, null);
            }

            console.log(res);

            if(res && res.rowCount) {
                callback(null, res.rows[0]);
            } else {
                callback(null, null);
            }

        });
    });

}

function getUsersTruck(userid, callback) {
    db.query(SQL_GET_USERS_TRUCK, [userid], function(err, res) {
        if(err) { return callback(err, null); }
        
        callback(null, res.rowCount ? res.rows[0].truckid : null);
    });
}

function loadUserData(request, user, callback) {
    getUsersTruck(user.id, function(err, truckid) {
        console.log("admin_truck = ", truckid);
        request.session.admin_truck = truckid;
        callback(err);
    });
}

/*
 * Handles actually displaying the page. This function takes in
 * the template data that should be passed on to the templating
 * engine.
 */
function route(request, response, data) {
    if( ! data.enteredUsername ) {
        data.enteredUsername = '';
    }
    response.render('login', data);
}

/*
 * The route for normal get requests to the login page.
 */
exports.route = function(request, response, data) {
    if(request.session.user) {
        return errorout(request, response, data, "You're already logged in.");
    }

    route(request, response, data);
};

exports.postRoute = function(request, response, data) {
    if(request.session.user) {
        /* Already logged in. */
        return errorout(request, response, data, "You're already logged in!");
    }

    var err = false;
    
    if(!request.body.name || !request.body.pass) {
        err = true;
        data.badLoginCredentials = true;
    } else {
        request.body.name = sanitize(request.body.name).trim();
        data.enteredUsername = request.body.name;
    }

    if(err) {
        return route(request, response, data);
    }

    // Try and get the user from the database
    getUser(request.body.name, request.body.pass, function(err, user) {
        
        if(!user) {
            err = true;
            data.badLoginCredentials = true;
            // Re-display the login page
            return route(request, response, data);
        } else {
            // Legitimate login
            request.session.user = user;
            // Load additional user data that should be stored in the session.
            loadUserData(request, user, function(err) {
                if(err) console.error(err);
                response.redirect('/');
            });
        }

    });

};
