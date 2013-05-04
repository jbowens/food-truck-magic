var db = require('./db.js').Database;

/* SQL YO */
var SQL_GET_TRUCK_BY_ID = 'SELECT * FROM trucks WHERE id = $1;';
var SQL_UPDATE_TRUCK_DATA = 'UPDATE trucks SET twitterName = $1, twitterId = $2,  phone = $3, ' +
                            'website = $4, name = $5, description= $6 WHERE id = $7;';
var SQL_GET_PHOTOS = 'SELECT uploads.* FROM photos LEFT JOIN uploads ON uploads.id = photos.uploadid WHERE photos.truckid = $1;';

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
     * - description
     *
     * The callback only takes one argument, the error if any occurred.
     */
    updateTruck: function(truckid, newTruckData, callback) {
        db.query(SQL_UPDATE_TRUCK_DATA,
                [newTruckData.twitterName, newTruckData.twitterId, newTruckData.phone, 
                 newTruckData.website, newTruckData.name, 
                 newTruckData.description, truckid],
                function(err) {
                    if(err) { console.error(err); }
                    callback(err);
                });
    },

    /* Retrieves the photos of a truck. */
    getPhotos: function(truckid, callback) {
        db.query(SQL_GET_PHOTOS,
                [truckid],
                function(err, res) {
                    if(err) { console.error(err); return callback(err, []); }
                    for(var i = 0; i < res.rows.length; i++) {
                        res.rows[i].serverFilename = res.rows[i].id.toString() + res.rows[i].ext;
                    }
                    console.log("retrieved ",res.rows.length," photos");
                    callback(null, res.rows);
                });
    }

};
