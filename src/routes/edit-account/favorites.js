var db = require('../../db.js').Database;
var bailout = require('../fatalerror.js').bailout;
var fourohfour = require('../fourohfour.js').route;


function renderPage(response, data) {
    response.render('edit-account-favorites', data);
}

exports.route = function(request, response, data) {
    if (!request.session.user) {
        data.badUserRoute = true;
        return fourohfour(request, response, data);
    }

    renderPage(response, data);
};

