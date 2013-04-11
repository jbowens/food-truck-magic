var _ = require('underscore');
var bailout = require('../fatalerror.js').bailout;
var fourohfour = require('../fourohfour.js').route;

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

    /* TODO: Everything. */
    renderPage(response, data);

};
