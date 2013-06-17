/* A route for collecting oauth authorization so that we can tweet on
 * behalf of trucks. This is part of the setup flow. Most of the actual
 * work happens on other endpoints through ajax calls.
 */
var fourohfour = require('../fourohfour.js').route;

/* It only makes sense for truck owners to hit this page.
 */
function hasPermission(request, response, data) {
    return !!(data.user && data.my_truck);
}

// TODO: Update route to handle case where the truck already has a
// twitter handle but has not yet setup OAuth so that we can tweet
// on their behalf.

exports.route = function(request, response, data) {
    if(!hasPermission(request, response, data)) {
        fourohfour(request, response, data);
    } else {
        response.render('setup-twitter', data);
    }
};
