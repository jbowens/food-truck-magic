/*
 * The route for the aggregate list of all trucks
 * TODO: For now, just going to show every single truck. we 
 * are going to have to be smarter about this later on.
 */

var db = require('../db.js').Database;
var fourOhFourRoute = require('./fourohfour.js').route;

/* SQL Queries */
var SQL_GET_TRUCKS = 'SELECT * FROM trucks';

exports.route = function(request, response) { 
    db.get(function(err, conn) {
        if (err) {
            console.error(err);
            return fourOhFourRoute(request, response);
        }

        conn.query(SQL_GET_TRUCKS, function(err, res) {
            db.release(conn);
            var trucks = res.rows;

            /* if the sql query somehow messes up */
            if (err || !res.rows.length) {
                if(err) {
                    console.error(err);
                }
                return fourOhFourRoute(request, response);
            }

            response.render('trucks',  {'trucks' : trucks});
        });
    });
};
