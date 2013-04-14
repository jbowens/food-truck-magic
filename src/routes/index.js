var _ = require('underscore');
var db = require('../db.js').Database;

exports.route = function(request, response, data) {
    function renderPage() {
        response.render('index', data);
    }

    if (request.session.user) {
        data.user = request.session.user;
    }

    renderPage();
};
