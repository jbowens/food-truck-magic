/*
 * The route for the /sign-up page.
 */
var _ = require('underscore');
var db = require('../db.js').Database;
var check = require('validator').check;
var sanitize = require('validator').sanitize;
var checkUsername = require('./api/check-username.js').checkUsername;
var bailout = require('./fatalerror.js').bailout;

/* SQL Queries */
var SQL_INSERT_USER = 'INSERT INTO users (name,pass,email) VALUES($1, $2, $3)';
var SQL_GET_ID = 'SELECT id FROM users WHERE name = $1 LIMIT 1';

var defaultTemplateData = {
    noEmail: false,
    noUsername: false,
    noPassword: false,
    usernameTaken: false,
    badEmail: false,
    enteredUsername: null,
    enteredPass: null,
    enteredEmail: null
};

function createUser(data, callback) {
    db.get(function(err, conn) {
        if(err) {
            callback(err, null);
        }

        var hashedPassword = require('../hasher.js').hash(data.pass);

        conn.query(SQL_INSERT_USER, [data.name, hashedPassword, data.email], function(err, res) {

            if(err) {
                db.release(conn);
                callback(err, null);
            }
            
            if(res && res.hasOwnProperty('rowCount') && res.rowCount) {
                // Insertion was successful. Get the id of the new user.
                conn.query(SQL_GET_ID, [data.name], function(err, res) {
                    db.release(conn);
                    if(err || !res || !res.rows || ! res.rows[0]) {
                        callback(err, null);
                    } else {
                        callback(null, res.rows[0].id);
                    }
                });
            } else {
                db.release(conn);
                callback(null, null);
            }

        });
    });
}

function postErrorRoute(request, response, data) {
    response.render('sign-up', data);
}

exports.route = function(request, response) {
    response.render('sign-up', defaultTemplateData);
};

exports.postRoute = function(request, response) {
    var data = _.clone(defaultTemplateData);
    var err = false;
    
    request.body.name = sanitize(request.body.name).trim();

    if(!request.body.email) {
        err = true;
        data.noEmail = true;
    }

    if(!request.body.name) {
        err = true;
        data.noUsername = true;
    }

    if(!request.body.pass) {
        err = true;
        data.noPassword = true;
    }

    data.enteredEmail = request.body.email;
    data.enteredPass = request.body.pass;
    data.enteredUsername = request.body.name;
    
    if(request.body.email) {
        try {
            check(request.body.email).isEmail();
        } catch(e) {
            err = true;
            data.badEmail = true;
        }
    }

    // TODO: Validate the username if we're going to put any restrictions
    // on what constitutes a valid username

    // TODO: Do we care enough to check if the username is taken
    // in the same transaction as creating the user?

    // If we hit a validation error, stop here.
    if(err) {
        return postErrorRoute(request, response, data);
    }

    checkUsername(request.body.name, function(error, taken) {
        
        if(error) {
            bailout(request, response, error);
        }

        if(taken) {
            err = true;
            data.usernameTaken = true;
        }
 
        createUser({
            'name': request.body.name,
            'pass': request.body.pass,
            'email': request.body.email
        }, function(error, userid) {

            if(error) {
                bailout(request, response, error);           
            }

            // Log the user in by saving the userid to the session
            request.session.userid = userid;

            /* TODO: Send an email to the user? */

            if(err) {
                postErrorRoute(request, response, data);
            } else {
                response.redirect('/');
            }
        });

    });
 
};
