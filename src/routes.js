/*
 * Routes homey.
 */

exports.setupRoutes = function(app) {
    app.get('/', require('./routes/index.js').route);
    app.get('/api/check-username/:username', require('./routes/api/check-username.js').route);

    app.post('/sign-up', require('./routes/sign-up.js').postRoute);
    app.get('/sign-up', require('./routes/sign-up.js').route);

    app.post('/login', require('./routes/login.js').postRoute);
    app.get('/login', require('./routes/login.js').route);

    app.get('/trucks', require('./routes/trucks.js').route);
    app.get('/truck/:truckidentifier', require('./routes/truck.js').route); 
    app.post('/api/follow-truck', require('./routes/api/follow-truck.js').postRoute);

    app.get('*', require('./routes/fourohfour.js').route);
    app.post('*', require('./routes/fourohfour.js').route);
};
