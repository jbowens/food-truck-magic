/*
 * Post route hit when a user wants to follow a food truck
 * (/truck/:truckidentifier/follow-truck) 
 *
 */
var db = require('../db.js').Database;
var SQL_INSERT_FOLLOWS = 'INSERT INTO follows (userid,truckid) VALUES($1, $2)';

exports.postRoute = function(request, response) {
    responseJSON = {
        error: ''
    };

    /* check if logged in */
    if (!request.session.user) {
        responseJSON.error = 'You are not logged in';
    }

    /* check if already following */
    
    response.json(responseJSON);
};
