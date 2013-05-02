var fourohfour = require('../fourohfour.js').route;

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

    response.render('edit-truck-location', data);
};
