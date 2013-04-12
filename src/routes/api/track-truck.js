/*
 * API route hit when a truck owner wants to modify open/closed status and
 * the location of the truck.
 */
var db = require('../../db.js').Database;
var bailout = require('../fatalerror.js').bailout;

var SQL_UPDATE_OPEN = "UPDATE trucks SET open = $1 WHERE id = $2";
var SQL_UPDATE_LOC = "UPDATE trucks SET geoPoint = ST_GeometryFromText('POINT($1,$2)' WHERE id = $2";

/*
 * Expects request.body to have the following:
 * setOpen - (optional) flag, true if opening truck, false otherwise
 * lat - (optional) latitude of truck's location
 * lon - (optional) longitude of truck's location
 */
exports.postRoute = function(request, response, data) {
    var returnData = {};

    if (!request.session.my_truck_id || !request.session.user) {
        returnData.success = false;
        response.json(returnData);
        return;
    }

    if (request.body.setOpen) {
        var setOpen = (request.body.setOpen == 'true');
        db.query(SQL_UPDATE_OPEN, [setOpen, request.session.my_truck_id], function(err, res) {
            if (!err) {
                returnData.success = true;
            }
            response.json(data);
        });
    }

    if (request.body.lat && request.body.lon) {
        var lat = request.body.lat;
        var lon = request.body.lon;
        /* TODO: actually insert point into db */
    }
};
