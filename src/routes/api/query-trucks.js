/*
 * Route hit to query trucks
 * TODO: this is going to get complicated.
 */

var db = require('../../db.js').Database;
var thumbnailer = require('../../thumbnailer.js').Thumbnailer;

/* Constants */
var THUMBNAIL_SIZE = 120;

var SQL_GET_TRUCKS = 'SELECT trucks.*, trucks.photoUploadid AS uploadid, uploads.ext FROM trucks ' +
                     'LEFT JOIN uploads ON uploads.id = trucks.photoUploadid';

var SQL_GET_FOLLOWED = 'SELECT trucks.* FROM follows INNER JOIN trucks on trucks.id = follows.truckid WHERE userid = $1';

exports.postRoute = function(request, response, data) {
    db.query(SQL_GET_TRUCKS, [], function(err, res) {
        if (err) {
            console.error(err);
            data.error = true;
            response.json(data);
            return;
        }

        data.trucks = res.rows;
        data.thumbnailSize = THUMBNAIL_SIZE;
        for (var i = 0; i < data.trucks.length; i++) {
            if (data.trucks[i].uploadid) {
                data.trucks[i].thumb = thumbnailer.getAppropriateThumbnail({
                    'id': data.trucks[i].uploadid,
                    'ext': data.trucks[i].ext
                }, THUMBNAIL_SIZE);
            }
        }

        response.json(data);
    });
};
