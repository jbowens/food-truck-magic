/*
 * The route for the /login page.
 */
var _ = require('underscore');
var db = require('../db.js').Database;
var hash = require('../hasher.js').hash;
var sanitize = require('validator').sanitize;
var bailout = require('./fatalerror.js').bailout;

/* SQL Queries */
var SQL_GET_USER = 'SELECT * FROM users WHERE name = $1 AND pass = $2';

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

/*
 * Fuck this templating engine.
 */
var defaultTemplateData = {
    badLoginCredentials: false,
    enteredUsername: ''
};

/*
 * Handles actually displaying the page. This function takes in
 * the template data that should be passed on to the templating
 * engine.
 */
function route(request, response, data) {
    response.render('login', data);
}

/*
 * The route for normal get requests to the login page.
 */
exports.route = function(request, response) {
    route(request, response, defaultTemplateData);
};

exports.postRoute = function(request, response) {
    var data = _.clone(defaultTemplateData);
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
            request.session.userid = user.id;
            response.redirect('/');
        }

    });

};
