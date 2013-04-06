/*
 * Post route hit when a user wants to follow a food truck
 * (/truck/:truckidentifier/follow-truck) 
 *
 */
var db = require('../db.js').Database;
var SQL_INSERT_FOLLOWS = 'INSERT INTO follows userid = $1 AND truckid = $2';
var SQL_DELETE_FOLLOWS = 'DELETE FROM follows WHERE userid = $1 AND truckid = $2;

exports.postRoute = function(request, response) {
    var setFollow = request.body.setFollow;
    var truckId = request.body.truckId;

    var responseJSON = {
        error: ''
    };

    /* check if logged in */
    if (!request.session.user) {
        responseJSON.error = 'You are not logged in';
    }

    if (setFollow) {

    } else {

    }
    
    response.json(responseJSON);
};
