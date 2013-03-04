/*
 * Routes homey.
 * Will eventually want to set up templating (maybe ejs?)
 */

exports.setupRoutes = function(app) {
    app.get('*', function(request, response) {
        response.writeHead(200, {'Content-Type' : 'text/html'});
        response.write('Hello World!');
        response.end();
    });
};
