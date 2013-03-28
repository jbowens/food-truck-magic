/*
 * The route for the /sign-up page.
 */
var db = require('../db.js').Database;
var fourOhFourRoute = require('./fourohfour.js').route;

/* SQL Queries */
var SQL_CHECK_USERNAME = "SELECT id FROM users WHERE name LIKE $1 LIMIT 1";

var defaultTemplateData = {
    noUsername: false,
    noPassword: false
};

exports.route = function(request, response) {
    response.render('sign-up', defaultTemplateData);
};

exports.postRoute = function(request, response) {
    var data = defaultTemplateData;
    var err = false;

    if(!request.body.name) {
        err = true;
        data.noUsername = true;
    }

    if(!request.body.pass) {
        err = true;
        data.noPassword = true;
    }

    if(err) {
        response.render('sign-up', data);
    } else {
        /* TODO: Redirect */
    }
};
