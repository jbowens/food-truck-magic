/*
 * Post route hit when a user wants to follow a food truck
 * (/truck/:truckidentifier/follow-truck) 
 *
 */
var db = require('../db.js').Database;
var bailout = require('./fatalerror.js').bailout;

var SQL_INSERT_FOLLOWS = 'INSERT INTO follows (userid,truckid) VALUES($1, $2)';
var SQL_DELETE_FOLLOWS = 'DELETE FROM follows WHERE userid = $1 AND truckid = $2';


exports.postRoute = function(request, response) {
    var setFollow = (request.body.setFollow == 'true');
    var truckId = request.body.truckId;

    var data = {
        error: ''
    };

    /* check if logged in */
    if (!request.session.user) {
        data.error = 'You are not logged in';
        response.json(data);
        return;
    }

    /* check if unfollowing or following */
    var queryString = SQL_DELETE_FOLLOWS;
    if (setFollow) {
        queryString = SQL_INSERT_FOLLOWS;
    }

    /* actually follow / unfollow */
    db.query(queryString, [request.session.user.id, truckId], function(err, res) {
        if (err) {
            /* oh god */
            bailout(request, response, err);           
        }
        response.json(data);
    });
};
