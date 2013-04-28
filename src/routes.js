var truckStore = require('./truckstore.js').TruckStore;

/*
 * Routes homey.
 */

exports.setupRoutes = function(app) {

    var r = function(routeFilename, route) {
        return function(request, response) {
            var data = {
                user: request.session.user,
                my_truck_id: request.session.my_truck_id
            };
            if(request.session.my_truck_id && request.session.user) {
                truckStore.getTruckById(request.session.my_truck_id, function(err, truck) {
                    if(err) { console.error(err); }
                    data.my_truck = truck;
                    runDataPreloader();
                });
            } else {
                runDataPreloader();
            }

            function runDataPreloader() {
                if(require(routeFilename).preloader) {
                    require(routeFilename).preloader(request, response, data, function() {
                        runRoute();
                    });
                } else {
                    runRoute();
                }
            }

            function runRoute() {
                route(request, response, data);
            }
        };
    };

    var get = function(path, routeFilename) {
        app.get(path, r(routeFilename, require(routeFilename).route));
    };

    var post = function(path, routeFilename) {
        app.post(path, r(routeFilename, require(routeFilename).postRoute));
    };

    get('/', './routes/index.js');
    post('/sign-up', './routes/sign-up.js');
    get('/sign-up', './routes/sign-up.js');
    get('/logout', './routes/logout.js');
    post('/login', './routes/login.js');
    get('/login', './routes/login.js');
    get('/trucks/:truckidentifier', './routes/truck.js');
    get('/edit-truck/info', './routes/edit-truck/info.js');
    post('/edit-truck/info', './routes/edit-truck/info.js');
    get('/edit-truck/photos', './routes/edit-truck/photos.js');
    post('/edit-truck/photos', './routes/edit-truck/photos.js');
    get('/edit-truck/location', './routes/edit-truck/location.js');
    get('/mapview', './routes/mapview.js');
    get('/edit-account', './routes/edit-account.js');
    post('/edit-account', './routes/edit-account.js');
    post('/api/follow-truck', './routes/api/follow-truck.js');
    get('/api/check-username/:username', './routes/api/check-username.js');
    post('/api/track-truck', './routes/api/track-truck.js');
    post('/api/get-geodata', './routes/api/get-geodata.js');
    post('/api/delete-photo', './routes/api/delete-photo.js');
    post('/api/query-trucks', './routes/api/query-trucks.js');
    get('*', './routes/fourohfour.js');
    post('*', './routes/fourohfour.js');

};
