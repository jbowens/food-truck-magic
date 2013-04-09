var db = require('./db.js').Database;

/* SQL YO */
var SQL_GET_TRUCK_BY_ID = 'SELECT * FROM trucks WHERE id = $1;';

/* A store for truck objects.
 */
exports.TruckStore = {

    /* Retrieves the truck with the given truckid.
     */
    getTruckById: function(truckid, callback) {
        db.query(SQL_GET_TRUCK_BY_ID, [truckid], function(err, res) {
            if(err) { return callback(err, null); }

            return callback(null, res.rowCount ? res.rows[0] : null);
        });

    }

};
