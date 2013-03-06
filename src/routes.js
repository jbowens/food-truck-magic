/*
 * Routes homey.
 */

exports.setupRoutes = function(app) {
    app.get('/', function(request, response) {
        response.render('index', {test : 'yolo'});
    });
};
