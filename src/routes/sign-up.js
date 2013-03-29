/*
 * The route for the /sign-up page.
 */
var _ = require('underscore');
var db = require('../db.js').Database;
var fourOhFourRoute = require('./fourohfour.js').route;
var checkUsername = require('./api/check-username.js').checkUsername;

/* SQL Queries */
var SQL_CHECK_USERNAME = "SELECT id FROM users WHERE name LIKE $1 LIMIT 1";

var defaultTemplateData = {
    noUsername: false,
    noPassword: false,
    usernameTaken: false,
    enteredUsername: null
};

exports.route = function(request, response) {
    response.render('sign-up', defaultTemplateData);
};

exports.postRoute = function(request, response) {
    var data = _.clone(defaultTemplateData);
    var err = false;

    if(!request.body.name) {
        err = true;
        data.noUsername = true;
    }

    if(!request.body.pass) {
        err = true;
        data.noPassword = true;
    }

    data.enteredUsername = request.body.name;

    // TODO: Do we care enough to check if the username is taken
    // in the same transaction as creating the user?

    checkUsername(request.body.name, function(error, taken) {
        
        if(error) {
            console.error(error);
            // TODO: Figure out what to do here. Print an
            // error message to the user?
        }

        if(taken) {
            err = true;
            data.usernameTaken = true;
        }
 
        /* TODO: Create user */
        /* TODO: Set user session to log them in */
        /* TODO: Send an email to the user? */

        if(err) {
            response.render('sign-up', data);
        } else {
            /* TODO: Redirect */
        }

    });
 
};
