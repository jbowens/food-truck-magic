/*
 * Routes homey.
 * Will eventually want to set up templating (maybe ejs?)
 */

exports.setupRoutes = function(app) {
    app.get('/', function(request, response) {
        response.render('index.ejs', {test : 'yolo'});
    });
};
