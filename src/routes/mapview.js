var db = require('../db.js').Database;
var bailout = require('./fatalerror.js').bailout;

var SQL_GET_GEO = "SELECT st_astext(geopoint), urlid, name, description FROM trucks WHERE open = true";
exports.route = function(request, response, data) {

    db.query(SQL_GET_GEO, [], function(err, res) {
        if (err) {
            console.log(err);
            bailout(request, res, err);
            return;
        }
        data.geodata = res.rows;

        response.render('mapview', data);
    });
};
