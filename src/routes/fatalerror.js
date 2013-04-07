/*
 * Displays the page that should be displayed when we fuck up
 * and everything is just fucked.
 */
exports.route = function(request, response, data) {
    response.status(500);
    response.render('fatalerror', data);
};

exports.bailout = function(request, response, data, errobj) {
    console.error(errobj);
    exports.route(request, response, data);
};
