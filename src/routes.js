var truckStore = require('./truckstore.js').TruckStore;
var fileUploader = require('./file-uploader.js');

/*
 * Routes homey.
 */

exports.setupRoutes = function(app) {

    var r = function(routeFilename, route) {
        return function(request, response) {
            /* 
             * generic catchall for response errors.
             * TODO: this might be a bit aggressive to catch all of them
             */
            response.on('error', function(e) {
                console.log("SOCKET HANGUP".red);
                console.log(e.stack.red);
            });

            var data = {
                user: request.session.user,
                my_truck_id: request.session.my_truck_id
            };
            data.thumbnailer = require('./thumbnailer.js').Thumbnailer;
            if(request.session.my_truck_id && request.session.user) {
                truckStore.getTruckById(request.session.my_truck_id, function(err, truck) {
                    if(err) { console.error(err); }
                    data.my_truck = truck;
                    if(truck.photouploadid) {
                        fileUploader.getUpload(truck.photouploadid, 
                            function(err, photo) {
                                data.my_truck.photo = photo;
                                runDataPreloader();
                            });
                    } else {
                        runDataPreloader();
                    }
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
    get('/about', './routes/about.js');
    get('/tos', './routes/tos.js');
    get('/privacy', './routes/privacy.js');
    post('/sign-up', './routes/sign-up.js');
    get('/sign-up', './routes/sign-up.js');
    get('/logout', './routes/logout.js');
    post('/login', './routes/login.js');
    get('/login', './routes/login.js');
    get('/trucks/:truckidentifier', './routes/truck.js');
    get('/setup/twitter', './routes/setup/twitter.js');
    get('/edit-truck/info', './routes/edit-truck/info.js');
    post('/edit-truck/info', './routes/edit-truck/info.js');
    get('/edit-truck/photos', './routes/edit-truck/photos.js');
    post('/edit-truck/photos', './routes/edit-truck/photos.js');
    get('/edit-truck/menu', './routes/edit-truck/menu.js');
    post('/edit-truck/menu', './routes/edit-truck/menu.js');
    get('/edit-truck/location', './routes/edit-truck/location.js');
    get('/mapview', './routes/mapview.js');
    get('/edit-account/password', './routes/edit-account/password.js');
    post('/edit-account/password', './routes/edit-account/password.js');
    get('/edit-account/favorites', './routes/edit-account/favorites.js');
    post('/api/follow-truck', './routes/api/follow-truck.js');
    get('/api/check-username/:username', './routes/api/check-username.js');
    post('/api/track-truck', './routes/api/track-truck.js');
    post('/api/delete-photo', './routes/api/delete-photo.js');
    post('/api/save-categories', './routes/api/save-categories.js');
    post('/api/query-trucks', './routes/api/query-trucks.js');
    post('/api/get-truck-tweets', './routes/api/get-truck-tweets.js');
    get('/api/get-favorites/:userId', './routes/api/get-favorites.js');
    post('/api/start-twitter-setup', './routes/api/start-twitter-setup.js');
    get('*', './routes/fourohfour.js');
    post('*', './routes/fourohfour.js');
};
