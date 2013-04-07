/*
 * API route hit when a user wants to follow or unfollow a food truck
 * (api/follow-truck/) 
 *
 */
var db = require('../../db.js').Database;
var bailout = require('../fatalerror.js').bailout;

var SQL_INSERT_FOLLOWS = 'INSERT INTO follows (userid,truckid) VALUES($1, $2)';
var SQL_DELETE_FOLLOWS = 'DELETE FROM follows WHERE userid = $1 AND truckid = $2';


/*
 * Expects request.body to have the following:
 * setFollow - flag, true if following, false otherwise
 * truckId - id of truck to follow
 * userId - id of user that is following
 */
exports.postRoute = function(request, response) {
    var setFollow = (request.body.setFollow == 'true');
    var truckId = request.body.truckId;
    var userId = request.body.userId;

    var data = {
        success: false
    };

    /* only allow if user is logged in */
    if (!request.session.user || request.session.user.id != userId) {
        success = false;
        response.json(data);
        return;
    }


    /* check if unfollowing or following */
    var queryString = SQL_DELETE_FOLLOWS;
    if (setFollow) {
        queryString = SQL_INSERT_FOLLOWS;
    }

    /* actually follow/unfollow */
    db.query(queryString, [request.session.user.id, truckId], function(err, res) {
        if (!err) {
            data.success = true;
        }
        response.json(data);
    });
};
