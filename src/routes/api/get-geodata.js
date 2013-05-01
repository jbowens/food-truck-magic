/*
 * TODO: THIS IS NOW USELESS GET RID OF IT
 * Route hit to get a location data of open food trucks
 */


var db = require('../../db.js').Database;
var SQL_GET_GEO = "SELECT st_astext(geopoint) AS point, urlid, name, description FROM trucks WHERE open = true";

var SQL_GET_GEO_SINGLE = "SELECT st_astext(geopoint) AS point, urlid, name, description FROM trucks WHERE open = true AND id = $1";

/*
 * Expects request.body to have the following parameters:
 * truckId - (optional) parameter to get geodata for just one truck
 */
exports.postRoute = function(request, response, data) {
    var sql = '';
    var sqlArgs = [];
    if (request.body.truckId) {
        sql = SQL_GET_GEO_SINGLE;
        sqlArgs = [request.body.truckId];
    } else {
        sql = SQL_GET_GEO;
    }

    data.error = false;
    db.query(sql, sqlArgs, function(err, res) {
        if (err) {
            data.error = true;
        } else {
            data.geodata = res.rows;
        }
        response.json(data);
    });
};
