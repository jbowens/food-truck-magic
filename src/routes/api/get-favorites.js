/*
 * The route for the api for getting the trucks a user follows
 */
var db = require('../../db.js').Database;
var fourOhFourRoute = require('../fourohfour.js').route;

var SQL_GET_FAVORITES = "SELECT trucks.id, trucks.name, trucks.urlid from trucks INNER JOIN follows ON follows.userid=$1 WHERE trucks.id = follows.truckid;";

exports.route = function(request, response, data) {
    if(!request.params.userId) {
        return fourOhFourRoute(request, response);
    } 

    if (request.params.userId != request.session.user.id) {
        return fourOhFourRoute(request, response);
    }

    db.query(SQL_GET_FAVORITES, [request.params.userId], function(err, res) {
        if (err) {
            data.error = true;
        } else {
            data.trucks = res.rows;
        }
        response.json(data);
    });
};
