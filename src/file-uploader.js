/* Saves uploaded files. This is completely untested. ;)
 */

var db = require('./db.js').Database;
var fs = require('fs');

/* SQL Queries */
var SQL_INSERT_UPLOAD = 'INSERT INTO uploads (filesize, mime, name, dateUploaded) VALUES($1, $2, $3, now());';
var SQL_GET_LAST_ID = 'SELECT lastval() AS uploadid;';

/* Inserts the given req.files object into the
 * database, returning the upload id for the
 * row that was created.
 */
function insertUpload(file, callback) {
    db.begin(function(err, tx) {
        if (err) { tx.end(); return callback(err, null); }
        tx.query(SQL_INSERT_UPLOAD, [file.size, file.type, file.name], function(err, res) {
            if(err) { tx.end(); return callback(err, null); }
            tx.query(SQL_GET_LAST_ID, function(err, res) {
                tx.commit();
                if(err) { return callback(err, null); }
                try {
                    if(!res || !res.rowCount) {
                        return callback(new Error("no rows returned"), null); 
                    }
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
exports.handleUpload = function(file, callback) {

    try {
        insertUpload(file, function(err, uploadid) {
            if(err) { console.error(err); return callback(err, null); }
            /* Now that we've inserted the upload into the database, we need
               to move the file into permanent storage. */
            fs.rename(file.path, __dirname + '../uploads/' + uploadid.toString(), function (err) {
                if(err) { console.error(err); return callback(err, null); }
                file.uploadid = uploadid;
                callback(null, uploadid);
            });
        });

    } catch(err) {
        callback(err, null);
    }

};


