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
 * textLoc - text location of truck
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
        var textLoc = request.body.textLoc;
        var SQL_UPDATE_OPEN = "UPDATE trucks SET open = $1, textLoc = $2, geoPoint = ST_PointFromText(";
        SQL_UPDATE_OPEN += "'POINT(" + request.body.lat + " " + request.body.lon + ")') WHERE id = $3";
        db.query(SQL_UPDATE_OPEN, [setOpen, textLoc, request.session.my_truck_id], function(err, res) {
            if (err) {
                console.log(err);
            } else {
                returnData.success = true;
            }
            response.json(returnData);
        });
    }
};
