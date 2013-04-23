/*
 * The route for the /sign-up page.
 */
var db = require('../db.js').Database;
var check = require('validator').check;
var sanitize = require('validator').sanitize;
var checkUsername = require('./api/check-username.js').checkUsername;
var bailout = require('./fatalerror.js').bailout;
var errorout = require('./error.js').errorout;

/* SQL Queries */
var SQL_INSERT_USER = 'INSERT INTO users (name,pass,email) VALUES($1, $2, $3)';
var SQL_INSERT_TRUCK = 'INSERT INTO trucks (name, urlid, open) VALUES($1, $2, \'f\');';
var SQL_INSERT_VENDOR = 'INSERT INTO vendors (userid, truckid) VALUES($1, $2);';
var SQL_GET_ID = 'SELECT id FROM users WHERE name = $1 LIMIT 1';

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
                        data.id = res.rows[0].id;
                        callback(null, data);
                    }
                });
            } else {
                db.release(conn);
                callback(null, null);
            }

        });
    });
}

function createTruck(data, callback) {
    /* TODO: This doesn't ensure that the urlid isn't duplicated (which would cause the sql
     * query to fail, but I really don't feel like doing that right now. */
    var urlid = data.truckname.replace(/[^A-z]/g, '').replace(/\s+/g, '-').toLowerCase();
    db.insertAndGetId(SQL_INSERT_TRUCK, [data.truckname, urlid], function(err, truckid) {
        if(err) { callback(err, null); }

        /* Insert the user as an admin of the truck. */
        db.query(SQL_INSERT_VENDOR, [data.userid, truckid], function(err) {
            if(err) { return callback(err, null); }

            callback(null, truckid);
        });

    });
}

function postErrorRoute(request, response, data) {
    response.render('sign-up', data);
}

exports.route = function(request, response, data) {
    if(request.session.user) {
        return errorout(request, response, data, "You're already registered and logged in!");
    }
    response.render('sign-up', data);
};

exports.postRoute = function(request, response, data) {
    if(request.session.user) {
        return errorout(request, response, data, "You've already registered and logged in!");
    }
    if(request.body.type != 'eater' && request.body.type != 'truck') {
        /* How the fuck did they get here? */
        return response.redirect('/sign-up');
    }

    /* The client side needs to know which form to display the
       validation errors on. */
    var validationData = {};
    if(request.body.type == 'eater') {
        data.eater = validationData;
        data.truck = {};
    } else {
        data.truck = validationData;
        data.eater = {};
    }

    var err = false;
    
    request.body.name = sanitize(request.body.name).trim();

    if(!request.body.email) {
        err = true;
        validationData.noEmail = true;
    }

    if(!request.body.name) {
        err = true;
        validationData.noUsername = true;
    }

    if(!request.body.pass) {
        err = true;
        validationData.noPassword = true;
    }

    validationData.enteredEmail = request.body.email;
    validationData.enteredPass = request.body.pass;
    validationData.enteredUsername = request.body.name;
    
    if(request.body.email) {
        try {
            check(request.body.email).isEmail();
        } catch(e) {
            err = true;
            validationData.badEmail = true;
        }
    }

    var isTruck = false;
    if(request.body.type == 'truck') {
        validationData.enteredTruckName = request.body.truckname;
        if(!request.body.truckname) {
            err = true;
            validationData.noTruckName = true;
        }
        isTruck = true;
    }

    try {
        check(request.body.name).isAlphanumeric();
    } catch(e) {
        err = true;
        validationData.usernameBad = true;
    }

    // TODO: Do we care enough to check if the username is taken
    // in the same transaction as creating the user?

    if(err && validationData.noUsername) {
        return postErrorRoute(request, response, data);
    }

    checkUsername(request.body.name, function(error, taken) {
        
        if(error) {
            bailout(request, response, error);
        }

        if(taken) {
            err = true;
            validationData.usernameTaken = true;
        }
 
        if(err) {
            return postErrorRoute(request, response, data);
        }

        createUser({
            'name': request.body.name,
            'pass': request.body.pass,
            'email': request.body.email
        }, function(error, user) {

            if(error) {
                bailout(request, response, data, error);           
            }

            // Log the user in by saving the user object to the session
            request.session.user = user;

            /* TODO: Send an email to the user? */

            if(err) {
                postErrorRoute(request, response, data);
            } else {
                if(isTruck) {
                    /* Time to insert the truck. */
                    createTruck({
                        truckname: request.body.truckname,
                        userid: user.id
                    }, function(error, truckid) {
                        
                        if(error) {
                            bailout(request, response, data, error);
                        }

                        request.session.my_truck_id = truckid;
                        response.redirect('/edit-truck/info');
                    });
                } else {
                    response.redirect('/');
                }
            }
        });

    });
 
};
