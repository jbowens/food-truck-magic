/*
 * The route for the main truck page.
 */
var _ = require('underscore');
var db = require('../db.js').Database;
var truckStore = require('../truckstore.js').TruckStore;
var fourOhFourRoute = require('./fourohfour.js').route;

/* SQL Queries */
var SQL_GET_TRUCK_BY_IDENTIFIER = "SELECT * FROM trucks WHERE urlid = $1 LIMIT 1";
var SQL_GET_FOLLOWS = "SELECT * FROM FOLLOWS WHERE userid = $1 AND truckid = $2";

exports.route = function(request, response, data) {
    data.following = false;

    var truckurlid = request.params.truckidentifier;

    /* Get the truck from the database! */
    db.query(SQL_GET_TRUCK_BY_IDENTIFIER, [truckurlid], function(err, res) {
       
        if(err || !res.rows.length) {
            db.release(conn);
            if(err) {
                console.error(err);
            }
            /* If the truck doesn't exist or something fucked up, treat it as a 404. */
            return fourOhFourRoute(request, response, data);
        }
       
        data.truck = res.rows[0];
        
        truckStore.getPhotos(data.truck.id, function(err, res) {
            console.log("photos, brah");
            data.photos = err ? [] : res;
            
            /* We have our truck. Let's check if logged in and following */
            if (request.session.user) {
                data.user  = request.session.user;
                var userId = data.user.id;
                db.query(SQL_GET_FOLLOWS, [userId, data.truck.id], function(err, res) {
                    if(err) {
                        console.error(err);
                        return fourOhFourRoute(request, response, data);
                    }

                    /* user is following this truck already */
                    if (res.rows.length) {
                        data.following = true;
                    }

                    response.render('truck', data);
                });
            } else {
                response.render('truck', data);
            }
        });
    });
};
