/* Saves uploaded files. This is completely untested. ;)
 */

var db = require('./db.js').Database;
var fs = require('fs');
var path = require('path');
var thumbnailer = require('./thumbnailer').Thumbnailer;
var isImage = require('./thumbnailer').isImage;

/* Constants */
var UPLOADS_DIR = __dirname + '/../uploads/';
exports.UPLOADS_DIR = UPLOADS_DIR;

/* SQL Queries */
var SQL_INSERT_UPLOAD = 'INSERT INTO uploads (filesize, mime, name, ext, dateUploaded, uploaderUserid) VALUES($1, $2, $3, $4, now(), $5);';
var SQL_DELETE_UPLOAD = 'DELETE FROM uploads WHERE id = $1;';
var SQL_GET_LAST_ID = 'SELECT lastval() AS uploadid;';
var SQL_GET_UPLOAD = 'SELECT * FROM uploads WHERE id = $1 LIMIT 1';

/* Inserts the given req.files object into the
 * database, returning the upload id for the
 * row that was created.
 */
function insertUpload(file, userid, callback) {
    db.begin(function(err, tx) {
        if (err) { tx.rollback(); return callback(err, null); }

        var ext = path.extname(file.name);
        file.ext = ext;
        tx.query(SQL_INSERT_UPLOAD, [file.size, file.type, file.name, ext, userid], function(err, res) {
            if(err) { tx.rollback(); return callback(err, null); }
            tx.query(SQL_GET_LAST_ID, function(err, res) {
                tx.commit();
                if(err) { return callback(err, null); }
                try {
                    if(!res || !res.rowCount) {
                        return callback(new Error("no rows returned"), null); 
                    }
                    file.id = res.rows[0].uploadid;
                    file.uploadid = file.id;
                    callback(null, res.rows[0].uploadid);
                } catch(err) {
                    callback(err, null);
                }
            });
        });

    });
}

/* This function expects file to be one of the objects that express
 * populates request.files with. It will move the file from temporary
 * storage (where node puts it), into the uploads directory. It'll
 * also create a record in the uploads table with the upload id of
 * the new record.
 */
exports.handleUpload = function(file, userid, callback) {

    try {
        insertUpload(file, userid, function(err, uploadid) {
            if(err) { console.error(err); return callback(err, null); }
            /* Now that we've inserted the upload into the database, we need
               to move the file into permanent storage. */
            fs.rename(file.path, UPLOADS_DIR + uploadid.toString() + file.ext, function (err) {
                if(err) { console.error(err); return callback(err, null); }
                file.uploadid = uploadid;

                if(isImage(file.ext)) {
                    thumbnailer.thumbnailify(file, function(err) {
                        callback(null, uploadid);
                    });
                } else {
                    callback(null, uploadid);
                }
            });
        });

    } catch(err) {
        callback(err, null);
    }

};

/* Retrieves the file object for the given upload id.
 */
exports.getUpload = function(uploadid, callback) {
    db.query(SQL_GET_UPLOAD, [uploadid], function(err, res) {
        if(err) { console.error(err); return callback(err, null); }

        if(!res || !res.rows.length) {
            return callback(null, null);
        }

        return callback(null, res.rows[0]);
    });
};

/* This function will handle removing a previously uploaded file. It
 * will remove it from the database of uploads and remove the file from
 * the filesystem. If it's an image, this function will also remove any
 * thumbnails that were created for the image.
 */
exports.deleteUpload = function(fileObj, callback) {
    /* Delete the record of the upload. */
    db.query(SQL_DELETE_UPLOAD, [fileObj.id], function(err) {
        if(err) { console.error(err); return callback(err); }
        
        /* Delete the actual file from the filesystem. */
        fs.unlink(fileObj.id.toString() + fileObj.ext, function(err) {
            if(err) { console.error(err); return callback(err); }

            if(isImage(fileObj.ext)) {
                /* This is an image. We should remove its thumbnails too. */
                thumbnailer.removeThumbnails(fileObj, callback);
            } else {
                callback(err);
            }
        });
    });
};

