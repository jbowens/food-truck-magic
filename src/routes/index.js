/*
 * The route for the index page. 
 * TODO: these queries suck, NEED to move to some better api endpoint
 */

exports.route = function(request, response, data) {
    response.render('index', data);
};
