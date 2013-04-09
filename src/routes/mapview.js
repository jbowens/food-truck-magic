var db = require('../db.js').Database;

exports.route = function(request, response, data) {
    response.render('mapview', data);
};
