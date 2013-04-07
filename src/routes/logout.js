/*
 * The route for the /login page.
 */
var _ = require('underscore');
var bailout = require('./fatalerror.js').bailout;
var errorout = require('./error.js').errorout;

exports.route = function(request, response) {
    if(!request.session.user) {
        return errorout(request, response, "You're not logged in!");
    }

    request.session.user = null;
    
    response.redirect('/');
};
