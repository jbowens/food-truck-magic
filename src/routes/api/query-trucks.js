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


/*
 * Appends the WHERE clause to the sql query.
 * Not the prettiest thing in the world.
 */
var appendFilters = function(sql, body) {
    args = [];
    var firstFilter = true;

    if ('open' in body) {
        if (firstFilter) {
            firstFilter = false;      
            sql += " WHERE ";
        } else {
            sql += " AND ";
        }
        args.push(body.open);
        sql += "trucks.open=$" + args.length;
    }

    if ('name' in body) {
        if (firstFilter) {
            firstFilter = false;      
            sql += " WHERE ";
        } else {
            sql += " AND ";
        }
        args.push("%" + body.name + "%");
        sql += "trucks.name ILIKE $" + args.length;
    }
    return [sql, args];
};



/*
 * Expects request.body to have the following parameters:
 * open - (optional) boolean specifying whether to query open/closed
 * name - (optional) string specifying whether to do a search
 */
exports.postRoute = function(request, response, data) {
    var tuple = appendFilters(SQL_GET_TRUCKS, request.body);
    var sql = tuple[0];
    var args = tuple[1];

    db.query(sql, args, function(err, res) {
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
