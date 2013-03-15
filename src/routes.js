/*
 * Routes homey.
 */

function fourOhFourRoute(request, response) {
    response.status(404);
    response.render('fourOhFour', {});
}


exports.setupRoutes = function(app) {
    app.get('/', function(request, response) {
        response.render('index', {test : 'yolo'});
    });

    app.get('*', fourOhFourRoute);
    app.post('*', fourOhFourRoute);
};
