/*
 * API route hit when a truck owner wants to modify open/closed status and
 * the location of the truck.
 */
var db = require('../../db.js').Database;

/*
 * Expects request.body to have the following:
 * setOpen - flag, true if opening truck, false otherwise
 * lat - latitude of truck's location
 * lon - longitude of truck's location
 */
exports.postRoute = function(request, response, data) {
    var returnData = {};

    if (!request.session.my_truck_id || !request.session.user) {
        returnData.success = false;
        response.json(returnData);
        return;
    }

    if (request.body.setOpen && request.body.lat && request.body.lon) {
        var setOpen = (request.body.setOpen == 'true');
        var SQL_UPDATE_OPEN = "UPDATE trucks SET open = $1, geoPoint = ST_PointFromText(";
        SQL_UPDATE_OPEN += "'POINT(" + request.body.lat + " " + request.body.lon + ")') WHERE id = $2";
        db.query(SQL_UPDATE_OPEN, [setOpen, request.session.my_truck_id], function(err, res) {
            if (err) {
                console.log(err);
            } else {
                returnData.success = true;
            }
            response.json(returnData);
        });
    }
};
