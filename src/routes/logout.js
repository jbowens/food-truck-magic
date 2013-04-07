/*
 * The route for the /login page.
 */
var errorout = require('./error.js').errorout;

exports.route = function(request, response, data) {
    if(!request.session.user) {
        return errorout(request, response, data, "You're not logged in!");
    }

    request.session.user = null;
    
    response.redirect('/');
};
