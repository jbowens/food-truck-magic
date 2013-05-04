var fourohfour = require('./../fourohfour.js').route;
var bailout = require('../fatalerror.js').bailout;
var errorout = require('../error.js').errorout;
var handleUpload = require('../../file-uploader.js').handleUpload;
var db = require('../../db.js').Database;

/* SQL Queries */
var SQL_UPDATE_MENU = 'UPDATE trucks SET menuUploadid = $1 WHERE id = $2';

function renderPage(response, data) {
    response.render('edit-truck-menu', data);
}

function hasPermission(request, response, data) {
    return !!(data.user && data.my_truck);
}

exports.route = function(request, response, data) {

    if(!hasPermission(request, response, data)) {
        /* The user must be logged in and the administrator for
           a truck to view this page. */
        data.badTruckRoute = true;
        return fourohfour(request, response, data);
    }

    renderPage(response, data);
};

exports.postRoute = function(request, response, data) {

    if(!hasPermission(request, response, data)) {
        data.badTruckRoute = true;
        return fourohfour(request, response, data);
    }

    if(!request.files || !request.files.menufile) {
        return errorout(request, response, data, 'You forgot to choose the image you\'d like to upload.');
    }

    handleUpload(request.files.menufile, request.session.user.id, function(err, uploadid, uploadedPhoto) {
        if(err) {
            return bailout(request, response, data, err);
        }

        /* Save the menu to the db */
        db.query(SQL_UPDATE_MENU, [uploadid, data.my_truck_id], function(err) {
            if(err) {
                return bailout(request, response, data, err);
            }

            data.my_truck.menuuploadid = uploadid;

            renderPage(response, data);
        });
    });

};
