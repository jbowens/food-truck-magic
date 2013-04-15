/*
 * Route hit to get a location data of open food trucks
 */


var db = require('../../db.js').Database;
var SQL_GET_GEO = "SELECT st_astext(geopoint) AS point, urlid, name, description FROM trucks WHERE open = true";

exports.route = function(request, response, data) {
    data.error = false;
    db.query(SQL_GET_GEO, [], function(err, res) {
        if (err) {
            data.error = true;
        } else {
            data.geodata = res.rows;
        }
        response.json(data);
    });
};
