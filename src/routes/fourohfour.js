/*
 * The route for 404 pages.
 */
exports.route = function(request, response) {
    response.status(404);
    response.render('fourOhFour', {});
};
