/*
 * The route used by /edit-truck/info to save categories.
 * (/api/save-categories)
 */
var categories = require('../../categories.js');
var security = require('../../security.js');

exports.postRoute = function(request, response, data) {
    
    /* Gotta be logged in as a truck. */
    if(!data.user || !data.my_truck) {
        data.success = false;
        data.permDenied = true;
        return response.json(data);
    }

    if(!request.body.cats)  {
        data.success = false;
        data.noCats = true;
        return response.json(data);
    }

    /* Save the classifications. */
    console.log(request.body.cats);
    categories.setClassifications(data.my_truck.id, request.body.cats);

    data.success = true;
    response.json(data);

};

