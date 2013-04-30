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

var JOIN_FOLLOWS = ' INNER JOIN follows on follows.truckid = trucks.id';


/*
 * Returns the WHERE clause to the sql query.
 * Not the prettiest thing in the world.
 */
var appendFilters = function(body) {
    var sql = SQL_GET_TRUCKS;
    var args = [];
    var filters = [];

    if ('follows' in body) {
        args.push(String(body.follows));
        filters.push("userid = $" + args.length);
        sql += JOIN_FOLLOWS;
    }

    if ('open' in body) {
        args.push(String(body.open));
        filters.push("trucks.open=$" + args.length);
    }

    if ('name' in body) {
        args.push("%" + String(body.name) + "%");
        filters.push("trucks.name ILIKE $" + args.length);
    }

    if ('range' in body) {
        var range = body.range;
        if ('lat' in range && 'lon' in range && 'distance' in range) {
            filters.push("st_dwithin(st_pointfromtext('POINT(" +
                    parseFloat(range.lat, 10) + " " + 
                    parseFloat(range.lon, 10) + ")'), trucks.geopoint, " + 
                    parseFloat(range.distance, 10) + ")");
        }
    }
    
    for (var i = 0; i < filters.length; i++) {
        if (i !== 0) {
            sql += " AND ";
        } else {
            sql += " WHERE ";
        }

        sql += filters[i];
    }

    return [sql, args];
};


/*
 * Expects request.body to have the following parameters:
 * open - (optional) boolean specifying whether to query open/closed
 * name - (optional) string specifying whether to do a search
 * range - (optional) object containing three keys lat, lon, distance
 * follows - (optional) userid of user to get trucks the user follows 
 */
exports.postRoute = function(request, response, data) {
    var tuple = appendFilters(request.body);
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
