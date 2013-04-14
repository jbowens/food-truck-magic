/*
 * The route for 404 pages.
 */
exports.route = function(request, response, data) {
    response.status(404);
    response.render('fourohfour', data);
};
