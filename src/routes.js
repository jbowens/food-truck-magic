/*
 * Routes homey.
 */

exports.setupRoutes = function(app) {

    var r = function(route) {
        return function(request, response) {
            var data = {
                user: request.session.user
            };
            route(request, response, data);
        };
    };

    var get = function(path, routeFilename) {
        app.get(path, r(require(routeFilename).route));
    };

    var post = function(path, routeFilename) {
        app.post(path, r(require(routeFilename).postRoute));
    };

    get('/', './routes/index.js');
    get('/api/check-username/:username', './routes/api/check-username.js');
    post('/sign-up', './routes/sign-up.js');
    get('/sign-up', './routes/sign-up.js');
    get('/logout', './routes/logout.js');
    post('/login', './routes/login.js');
    get('/login', './routes/login.js');
    get('/trucks', './routes/trucks.js');
    get('/trucks/:truckidentifier', './routes/truck.js');
    post('/api/follow-truck', './routes/api/follow-truck.js');
    get('*', './routes/fourohfour.js');
    post('*', './routes/fourohfour.js');

};
