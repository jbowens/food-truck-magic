/*
 * Routes homey.
 */

exports.setupRoutes = function(app) {
    app.get('/', function(request, response) {
        response.render('index', {test : 'yolo'});
    });

    app.post('/sign-up', require('./routes/sign-up.js').postRoute);
    app.get('/sign-up', require('./routes/sign-up.js').route);
    app.get('/truck/:truckidentifier', require('./routes/truck.js').route);
    app.get('*', require('./routes/fourohfour.js').route);
    app.post('*', require('./routes/fourohfour.js').route);
};
