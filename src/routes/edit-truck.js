var _ = require('underscore');
var truckStore = require('../truckstore.js').TruckStore;
var bailout = require('./fatalerror.js').bailout;
var fourohfour = require('./fourohfour.js').route;

exports.route = function(request, response, data) {

    if(!data.user || !data.my_truck) {
        /* The user must be logged in and the administrator for
           a truck to view this page. */
        console.log('Permission denied to /edit-truck because not a truck admin');
        return fourohfour(request, response, data);
    }

    renderPage();

    function renderPage() {
        response.render('edit-truck', data);
    }
};
