/*
 * Displays the page that should be displayed when we fuck up
 * and everything is just fucked.
 */
exports.route = function(request, response) {
    response.status(500);
    response.render('fatalerror', {});
};

exports.bailout = function(request, response, errobj) {
    console.error(errobj);
    exports.route(request, response);
};
