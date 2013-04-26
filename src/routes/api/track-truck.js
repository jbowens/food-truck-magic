/*
 * API route hit when a truck owner wants to modify open/closed status and
 * the location of the truck.
 */
var db = require('../../db.js').Database;


var generateSQL = function(lat, lon, openFor) {
    var sql = "UPDATE trucks SET open = $1, textLoc = $2, ";
    if (openFor) {
        sql += "dateClose = now() + INTERVAL '" + parseInt(openFor, 10) + " seconds', ";
    }
    sql += "geopoint = ST_PointFromText('POINT(" + parseFloat(lat, 10) + " " + parseFloat(lon, 10) + ")') WHERE id = $3";

    return sql;
};

/*
 * Expects request.body to have the following:
 * setOpen - flag, true if opening truck, false otherwise
 * lat - latitude of truck's location
 * lon - longitude of truck's location
 * textLoc - text location of truck
 * (optional) openFor - How much time in seconds to wait before closing the truck
 */
exports.postRoute = function(request, response, data) {
    var returnData = {};

    if (!request.session.my_truck_id || !request.session.user) {
        returnData.success = false;
        response.json(returnData);
        return;
    }
    if ('setOpen' in request.body && 'lat' in request.body &&
            'lon' in request.body && 'textLoc' in request.body) {

        var setOpen = (request.body.setOpen == 'true');
        var textLoc = request.body.textLoc;
        var sql = generateSQL(request.body.lat, request.body.lon, request.body.openFor);

        db.query(sql, [setOpen, textLoc, request.session.my_truck_id], function(err, res) {
            if (err) {
                console.log(err);
            } else {
                returnData.success = true;
            }
            response.json(returnData);
        });
    }
};
