var truckStore = require('./truckstore.js').TruckStore;

/*
 * Routes homey.
 */

exports.setupRoutes = function(app) {

    var r = function(route) {
        return function(request, response) {
            var data = {
                user: request.session.user,
                my_truck_id: request.session.my_truck_id
            };
            if(request.session.my_truck_id && request.session.user) {
                truckStore.getTruckById(request.session.my_truck_id, function(err, truck) {
                    data.my_truck = truck;
                    runRoute();
                });
            } else {
                runRoute();
            }

            function runRoute() {
                route(request, response, data);
            }
        };
    };

    var get = function(path, routeFilename) {
        app.get(path, r(require(routeFilename).route));
    };

    var post = function(path, routeFilename) {
        app.post(path, r(require(routeFilename).postRoute));
    };

    get('/', './routes/index.js');
    post('/sign-up', './routes/sign-up.js');
    get('/sign-up', './routes/sign-up.js');
    get('/logout', './routes/logout.js');
    post('/login', './routes/login.js');
    get('/login', './routes/login.js');
    get('/trucks', './routes/trucks.js');
    get('/trucks/:truckidentifier', './routes/truck.js');
    get('/edit-truck', './routes/edit-truck.js');
    post('/api/follow-truck', './routes/api/follow-truck.js');
    get('/api/check-username/:username', './routes/api/check-username.js');
    get('*', './routes/fourohfour.js');
    post('*', './routes/fourohfour.js');

};
