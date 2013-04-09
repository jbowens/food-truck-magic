var _ = require('underscore');
var db = require('../db.js').Database;
var fourohfour = require('./fourohfour.js').route;

exports.route = function(request, response, data) {

    if(!data.user || !data.admin_truck) {
        /* The user must be logged in and the administrator for
           a truck to view this page. */
        console.log('Permission denied to /edit-truck because not a truck admin');
        return fourohfour(request, response, data);
    }

    function renderPage() {
        response.render('edit-truck', data);
    }

    renderPage();
};
