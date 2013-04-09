var _ = require('underscore');
var truckStore = require('../truckstore.js').TruckStore;
var bailout = require('./fatalerror.js').bailout;
var fourohfour = require('./fourohfour.js').route;

exports.route = function(request, response, data) {

    if(!data.user || !data.admin_truck) {
        /* The user must be logged in and the administrator for
           a truck to view this page. */
        console.log('Permission denied to /edit-truck because not a truck admin');
        return fourohfour(request, response, data);
    }

    truckStore.getTruckById(data.admin_truck, function(err, truck) {
  
        if(err) {
            return bailout(request, response, data, err);
        }

        data.truck = truck;
        renderPage();

    });

    function renderPage() {
        response.render('edit-truck', data);
    }
};
