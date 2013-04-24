/*
 * The route for the index page. 
 */

exports.route = function(request, response, data) {
    response.render('index', data);
};
