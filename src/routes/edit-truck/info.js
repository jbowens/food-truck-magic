var _ = require('underscore');
var check = require('validator').check;
var sanitize = require('validator').sanitize;
var categories = require('../../categories.js');
var truckStore = require('../../truckstore.js').TruckStore;
var fourohfour = require('./../fourohfour.js').route;

function renderPage(response, data) {
    response.render('edit-truck-info', data);
}

function hasPermission(request, response, data) {
    return !!(data.user && data.my_truck);
}

/**
 * Preloads the categories for the form.
 */
exports.preloader = function(request, response, data, callback) {
    categories.getAllCategories(function(err, cats) {
        categories.getTrucksCategories(data.my_truck.id, function(err, truck_cats) {
            if(err) { console.error(err); }
            data.categories = cats;
            data.truckCategories = truck_cats;
            callback();
        });
    });
};

exports.route = function(request, response, data) {

    if(!hasPermission(request, response, data)) {
        /* The user must be logged in and the administrator for
           a truck to view this page. */
        console.log('Permission denied to /edit-truck/info because not a truck admin');
        return fourohfour(request, response, data);
    }

    renderPage(response, data);

};

exports.postRoute = function(request, response, data) {

    if(!hasPermission(request, response, data)) {
        return fourohfour(request, response, data);
    }

    var err = false;
    var newTruckData = _.clone(data.my_truck);

    if(!request.body.name) {
        err = true; data.noName = true;
    } else {
        request.body.name = sanitize(request.body.name).trim();
    }
/* Validate the url */
    try {
        if(request.body.website) {
            check(request.body.website).isUrl();
        }
    } catch(e) {
        err = true;
        data.badWebsite = true;
        data.enteredWebsite = request.body.website;
    }

    /* TODO: Validate the phone number and twitter handle, plus
     * add client-side validation. */

    newTruckData.name = request.body.name;
    newTruckData.website = request.body.website;
    newTruckData.phone = request.body.phone;
    newTruckData.twitterName = request.body.twitterName;
    newTruckData.description = request.body.description;

    if(err) {
        /* There was a validation error and we shouldn't try and save
         * changes to the db. */
        data.validationError = true;
        return renderPage(response, data);
    }

    if(!_.isEqual(data.my_truck, newTruckData)) {
        truckStore.updateTruck(data.my_truck_id, newTruckData, function(err) {
            if(err) { console.error(err); }
            data.my_truck = newTruckData;
            data.changesSaved = true;
            renderPage(response, data);
        });
    } else {
        renderPage(response, data);
    }

};
