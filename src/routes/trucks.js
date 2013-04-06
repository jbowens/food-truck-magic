/*
 * The route for the aggregate list of all trucks
 */

var _ = require('underscore');
var db = require('../db.js').Database;
var fourOhFourRoute = require('./fourohfour.js').route;

/* SQL Queries */
var SQL_GET_TRUCKS = 'SELECT * FROM trucks';
var SQL_GET_FOLLOWED = 'SELECT trucks.* FROM follows INNER JOIN trucks on trucks.id = follows.truckid WHERE userid = $1';


var defaultTemplateData = {
    user: null,
    allTrucks: [],
    followedTrucks: [],
};

exports.route = function(request, response) { 
    var data = _.clone(defaultTemplateData);
    data.user = request.session.user;
    
    /* query for all trucks */
    db.query(SQL_GET_TRUCKS, [], function(err, res) {
        if (err) {
            console.error(err);
            return fourOhFourRoute(request, response);
        }
        data.allTrucks = res.rows;

        /* if logged in, query for trucks user follows */
        if (data.user) {
            db.query(SQL_GET_FOLLOWED, [data.user.id], function(err, res) {
                if (err) {
                    console.error(err);
                    return fourOhFourRoute(request, response);
                }
                data.followedTrucks = res.rows;
                response.render('trucks', data);
            });
        } else {
            response.render('trucks', data);
        }
    });
};
