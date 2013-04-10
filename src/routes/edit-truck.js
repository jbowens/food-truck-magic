var _ = require('underscore');
var truckStore = require('../truckstore.js').TruckStore;
var bailout = require('./fatalerror.js').bailout;
var fourohfour = require('./fourohfour.js').route;

function renderPage(response, data) {
    response.render('edit-truck', data);
}

function hasPermission(request, response, data) {
    return !!(data.user && data.my_truck);
}

exports.route = function(request, response, data) {

    if(!hasPermission(request, response, data)) {
        /* The user must be logged in and the administrator for
           a truck to view this page. */
        console.log('Permission denied to /edit-truck because not a truck admin');
        return fourohfour(request, response, data);
    }

    renderPage(response, data);

};

exports.postRoute = function(request, response, data) {

    if(!hasPermission(request, response, data)) {
        return fourohfour(request, response, data);
    }

    var newTruckData = _.clone(data.my_truck);

    /* TODO: Validate shit, both here and client-side. */

    newTruckData.website = request.body.website;
    newTruckData.phone = request.body.phone;
    newTruckData.twitterName = request.body.twitterName;

    if(!_.isEqual(data.my_truck, newTruckData)) {
        truckStore.updateTruck(data.my_truck_id, newTruckData, function(err) {
            data.my_truck = newTruckData;
            updateTruckName();
        });
    } else {
        updateTruckName();
    }

    function updateTruckName(err) {

        if(request.body.name != data.my_truck.name) {
            /* Update the truck name if necessary. */
            /* TODO: Shit. */
        }

        renderPage(response, data);
    }

};
