var db = require('./db.js').Database;

/* SQL YO */
var SQL_GET_TRUCK_BY_ID = 'SELECT * FROM trucks WHERE id = $1;';
var SQL_UPDATE_TRUCK_DATA = 'UPDATE trucks SET twitterName = $1, phone = $2, ' +
                            'website = $3, name = $4 WHERE id = $5;';

/* A store for truck objects.
 */
exports.TruckStore = {

    /* Retrieves the truck with the given truckid.
     */
    getTruckById: function(truckid, callback) {
        db.query(SQL_GET_TRUCK_BY_ID, [truckid], function(err, res) {
            if(err) { console.error(err); return callback(err, null); }

            return callback(null, res.rowCount ? res.rows[0] : null);
        });

    },

    /* Updates basic truck data in the database. This only updates a subset of the
     * data found in the table. Currently it updates the following fields:
     *
     * - twitterName
     * - phone
     * - website
     * - name
     *
     * The callback only takes one argument, the error if any occurred.
     */
    updateTruck: function(truckid, newTruckData, callback) {
        db.query(SQL_UPDATE_TRUCK_DATA,
                [newTruckData.twitterName, newTruckData.phone, 
                 newTruckData.website, newTruckData.name, truckid],
                function(err, res) {
                    if(err) { console.error(err); }
                    callback(err);
                });
    }

};
