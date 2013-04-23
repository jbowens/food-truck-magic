/*
 * The route to use when deleting a photo (through an ajax call)
 * (/api/delete-photo)
 */
var db = require('../../db.js').Database;
var security = require('../../security.js');
var getUpload = require('../../file-uploader.js' ).getUpload;
var deleteUpload = require('../../file-uploader.js').deleteUpload;

/* SQL 4 lyfe */
var SQL_DELETE_PHOTO = 'DELETE FROM photos WHERE uploadid = $1';
var SQL_UPDATE_PROF_PICS = 'UPDATE trucks SET photoUploadid = NULL WHERE photoUploadid = $1';

exports.postRoute = function(request, response, data) {
    
    /* Only allow if user is logged in */
    if (!data.user || !data.my_truck) {
        data.success = false;
        data.permDenied = true;
        return response.json(data);
    }

    if(!request.body.uploadid) {
        data.success = false;
        data.noUploadid = true;
        return response.json(data);
    }

    if(!security.csrfTokenMatches(request, request.body.csrfToken)) {
        data.success = false;
        data.csrfFailed = true;
        return response.json(data);
    }

    getUpload(request.body.uploadid, function(err, uploadOfPhoto) {
        if(err) console.error(err);

        /* They can only remove the upload if the were the original
         * uploader. */
        if(uploadOfPhoto.uploaderuserid != data.user.id) {
            data.success = false;
            data.permDenied = true;
            return response.json(data);
        }

        /* Delete the record associating the upload with the truck. */
        db.query(SQL_DELETE_PHOTO, [request.body.uploadid], function(err) {
            if(err) { console.error(err); data.success = false; return response.json(data); }

            if(uploadOfPhoto) {
                /* Remove the photo as a prof pic before deleting the upload. */
                db.query(SQL_UPDATE_PROF_PICS, [request.body.uploadid], function(err) {
                    if(err) { console.error(err); data.success = false; return response.json(data); }

                    deleteUpload(uploadOfPhoto, function(err) {
                        if(err) console.error(err);
                        data.success = !err;
                        return response.json(data);
                    });
                });
            } else {
                data.success = true;
                return response.json(data);
            }
        });
    });
};
