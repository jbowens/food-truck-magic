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
 * openFor - How much time in seconds to wait before closing the truck
 */
exports.postRoute = function(request, response, data) {
    var returnData = {};

    if (!request.session.my_truck_id || !request.session.user) {
        returnData.success = false;
        response.json(returnData);
        return;
    }

    /* TODO: this is in a miserable state */
    if (request.body.setOpen && request.body.lat && request.body.lon) {
        var setOpen = (request.body.setOpen == 'true');
        var textLoc = request.body.textLoc;
        var SQL_UPDATE_OPEN = "UPDATE trucks SET open = $1, textLoc = $2, dateClose = now() + INTERVAL '";
        SQL_UPDATE_OPEN += parseInt(request.body.openFor, 10) + " seconds', geoPoint = ST_PointFromText(";
        SQL_UPDATE_OPEN += "'POINT(" + parseFloat(request.body.lat, 10) + " " + parseFloat(request.body.lon, 10) + ")') WHERE id = $3";
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
