/*
 * The route for the main truck page.
 */
var db = require('../db.js').Database;
var fourOhFourRoute = require('./fourohfour.js').route;

/* SQL Queries */
var SQL_GET_TRUCK_BY_IDENTIFIER = "SELECT * FROM trucks WHERE urlid = $1 LIMIT 1";

exports.route = function(request, response) {
    var truckurlid = request.params.truckidentifier;

    /* Get the truck from the database! */
    db.get(function(err, conn) {
        if(err) {
            console.error(err);
            return fourOhFourRoute(request, response);
        }

        conn.query(SQL_GET_TRUCK_BY_IDENTIFIER, [truckurlid], function(err, res) {

            db.release(conn);
           
            if(err || !res.rows.length) {
                if(err) {
                    console.error(err);
                }
                /* If the truck doesn't exist or something fucked up, treat it as a 404. */
                return fourOhFourRoute(request, response);
            }
           
            var truck = res.rows[0];
            console.log(truck);
            response.render('truck', {'truck': truck});
            
        });
    });
};
