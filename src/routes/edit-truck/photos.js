var db = require('../../db.js').Database;
var bailout = require('../fatalerror.js').bailout;
var errorout = require('../error.js').errorout;
var fourohfour = require('../fourohfour.js').route;
var handleUpload = require('../../file-uploader.js').handleUpload;
var truckStore = require('../../truckstore.js').TruckStore;
var security = require('../../security.js');

var SQL_INSERT_PHOTO = 'INSERT INTO photos (truckid, uploadid, description) VALUES($1, $2, $3)';
var SQL_UPDATE_PROF_PIC = 'UPDATE trucks SET photoUploadid = $1 WHERE id = $2;';

function renderPage(response, data) {
    response.render('edit-truck-photos', data);
}

function hasPermission(request, response, data) {
    return !!(data.user && data.my_truck);
}

/**
 * Loads all of the photos for this truck regardless of whether
 * the GET or POST route is used. It is invoked by the routing
 * code in routes.js.
 */
exports.preloader = function(request, response, data, callback) {
    if(hasPermission(request, response, data)) {
        data.csrfToken = security.generateCsrfToken(request);
        truckStore.getPhotos(data.my_truck.id, function(err, photos) {
            if(err) { console.error(err); }
            data.photos = photos;
            callback();
        });
    } else {
        callback();
    }
};

exports.route = function(request, response, data) {

    if(!hasPermission(request, response, data)) {
        /* The user must be logged in and the administrator for
           a truck to view this page. */
        return fourohfour(request, response, data);
    }

    renderPage(response, data);

};

exports.postRoute = function(request, response, data) {

    if(!hasPermission(request, response, data)) {
        return fourohfour(request, response, data);
    }

    if(!request.files || !request.files.photo) {
        return errorout(request, response, data,
                'You forget to choose the photo you\'d like to upload.');
    }

    handleUpload(request.files.photo, function(err, uploadid) {
        if(err) {
            return bailout(request, response, data, err);
        }

        db.query(SQL_INSERT_PHOTO, [data.my_truck.id,
                                    uploadid,
                                    request.body.desc || ''],
                                    updateProfPic);

        function updateProfPic(err) {
            if(err) {
                return bailout(request, response, data, err);
            }

            db.query(SQL_UPDATE_PROF_PIC, [uploadid, data.my_truck_id], function(err) {
                if(err) { console.error(err); }
                renderPage(response, data);
            });
        }

    });

};
