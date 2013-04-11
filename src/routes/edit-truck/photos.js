var _ = require('underscore');
var bailout = require('../fatalerror.js').bailout;
var errorout = require('../error.js').errorout;
var fourohfour = require('../fourohfour.js').route;
var handleUpload = require('../../file-uploader.js').handleUpload;

function renderPage(response, data) {
    response.render('edit-truck-photos', data);
}

function hasPermission(request, response, data) {
    return !!(data.user && data.my_truck);
}

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
                "You forget to choose the photo you'd like to upload.");
    }

    handleUpload(request.files.photo, function(err, uploadid) {
        /* TODO: lots of things. */
        renderPage(response, data);
    });

};
